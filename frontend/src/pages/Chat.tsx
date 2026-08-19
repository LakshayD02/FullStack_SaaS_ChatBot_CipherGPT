import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import toast from "react-hot-toast";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
  getThreadMessages,
  deleteUserThread,
  updateUserProfile,
} from "../helpers/api-communicator";
import {
  extractPdfText,
  readImageAsBase64,
  formatFileSize,
  type AttachedFile,
} from "../helpers/file-parser";
import {
  FiTrash2,
  FiMenu,
  FiX,
  FiPlus,
  FiSettings,
  FiPaperclip,
  FiSearch,
  FiSquare,
  FiSidebar,
  FiFile,
  FiImage,
  FiMessageSquare,
  FiCpu,
  FiLoader,
  FiAlertCircle,
  FiArrowDown,
} from "react-icons/fi";
import "../index.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  isNew?: boolean;
};

type Thread = {
  id: string;
  title: string;
  createdAt: string;
};

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a TypeScript function to debounce an API call",
  "Design a modern SaaS landing page UI system",
  "Help me troubleshoot a MongoDB connection timeout",
];

/* ─── Confirm Delete Modal ─── */
const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20000,
      backdropFilter: "blur(4px)",
    }}
  >
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius)",
        padding: "28px 32px",
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 0 30px rgba(0,0,0,0.6)",
      }}
    >
      <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn btn-danger"
          style={{ padding: "8px 18px", fontWeight: 600 }}
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // States
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThreadLoading, setIsThreadLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop sidebar toggle
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Confirm delete modal
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });

  // Settings & Profile Edit States
  const [showSettings, setShowSettings] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // Show button if user has scrolled up by more than 400px from the bottom
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 400;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottomDirect = () => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const loadThreadsList = async (silent = false) => {
    if (!silent) toast.loading("Fetching chats…", { id: "threads" });
    try {
      const data = await getUserChats();
      setThreads(data.threads || []);
      if (!silent) toast.dismiss("threads");
    } catch {
      if (!silent) toast.error("Failed to load chat history", { id: "threads" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      setProfileName(auth.user.name);
      setProfileEmail(auth.user.email);
      loadThreadsList();
    }
  }, [auth?.isLoggedIn]);

  useEffect(() => {
    if (!auth?.isLoggedIn || !auth.user) navigate("/login");
  }, [auth?.isLoggedIn, auth?.user]);

  const handleSelectThread = async (id: string) => {
    if (activeThreadId === id) return; // already loaded
    setActiveThreadId(id);
    setIsMobileSidebarOpen(false);
    setChatMessages([]); // clear immediately while loading
    setIsThreadLoading(true);
    try {
      const data = await getThreadMessages(id);
      const msgs = data.chats || [];
      if (msgs.length === 0) {
        toast("This conversation has no messages.");
      }
      setChatMessages(msgs);
    } catch {
      toast.error("Failed to load messages");
      setChatMessages([]);
    } finally {
      setIsThreadLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveThreadId(null);
    setChatMessages([]);
    setAttachedFiles([]);
    setIsProcessingFiles(false);
    setIsMobileSidebarOpen(false);
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  const handleStopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleSubmit = async (content?: string) => {
    const text = content ?? inputRef.current?.value.trim();
    if (!text && attachedFiles.length === 0) return;
    if (isProcessingFiles) {
      toast.error("Please wait, files are still being processed.");
      return;
    }

    // Build rich message content including actual extracted file content
    const parts: string[] = [];
    if (text) parts.push(text);

    for (const af of attachedFiles) {
      if (af.status === "ready") {
        if (af.type === "pdf" && af.extractedText) {
          parts.push(
            `\n\n[PDF Attachment: ${af.name}] (${af.size})\n\`\`\`\n${af.extractedText.slice(0, 12000)}${af.extractedText.length > 12000 ? "\n...[truncated for length]" : ""}\n\`\`\``
          );
        } else if (af.type === "image") {
          parts.push(
            `\n\n[Image Attachment: ${af.name}] (${af.size})\n_Note: This model does not support inline image analysis. Please describe the image content or use a vision-capable model._`
          );
        }
      }
    }

    const fullContent = parts.join("");

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "auto";
    }
    setAttachedFiles([]);

    const newMessage: Message = { role: "user", content: fullContent, isNew: true };
    setChatMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setIsMobileSidebarOpen(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const data = await sendChatRequest(fullContent, activeThreadId || undefined, controller.signal);
      if (!controller.signal.aborted) {
        const chats = data.chats || [];
        const mapped = chats.map((m: any, idx: number) => ({
          ...m,
          isNew: idx === chats.length - 1,
        }));
        setChatMessages(mapped);
        if (!activeThreadId) {
          setActiveThreadId(data.threadId);
          loadThreadsList(true);
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError" && !controller.signal.aborted) {
        toast.error("Unable to get response. Please try again.", { id: "senderr" });
        setChatMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    // Create pending placeholders immediately so user sees feedback
    const pending: AttachedFile[] = files.map((f) => ({
      file: f,
      name: f.name,
      type: f.type === "application/pdf"
        ? "pdf"
        : f.type.startsWith("image/")
        ? "image"
        : "other",
      size: formatFileSize(f.size),
      status: "processing",
    }));
    setAttachedFiles((prev) => [...prev, ...pending]);
    setIsProcessingFiles(true);

    // Process each file in parallel
    const startIdx = attachedFiles.length; // index offset in state
    const processed = await Promise.all(
      pending.map(async (af): Promise<AttachedFile> => {
        try {
          if (af.type === "pdf") {
            const text = await extractPdfText(af.file);
            if (!text.trim()) {
              return { ...af, status: "error", errorMsg: "No readable text found (scanned PDF?)" };
            }
            return { ...af, extractedText: text, status: "ready" };
          } else if (af.type === "image") {
            const url = await readImageAsBase64(af.file);
            return { ...af, previewUrl: url, status: "ready" };
          } else {
            return { ...af, status: "error", errorMsg: "Unsupported file type" };
          }
        } catch (err) {
          return { ...af, status: "error", errorMsg: "Failed to read file" };
        }
      })
    );

    // Replace pending entries with processed results
    setAttachedFiles((prev) => {
      const updated = [...prev];
      processed.forEach((af, i) => {
        updated[startIdx + i] = af;
      });
      return updated;
    });
    setIsProcessingFiles(false);

    const errors = processed.filter((f) => f.status === "error");
    const ready = processed.filter((f) => f.status === "ready");
    if (errors.length > 0) {
      errors.forEach((f) => toast.error(`${f.name}: ${f.errorMsg}`));
    }
    if (ready.length > 0) {
      toast.success(
        ready.length === 1
          ? `✓ ${ready[0].name} ready`
          : `✓ ${ready.length} files ready`
      );
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Delete single thread with confirmation modal
  const handleDeleteThread = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const thread = threads.find((t) => t.id === id);
    setConfirmModal({
      open: true,
      title: "Delete conversation?",
      message: `"${thread?.title || "This conversation"}" will be permanently deleted. This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        try {
          await deleteUserThread(id);
          setThreads((prev) => prev.filter((t) => t.id !== id));
          if (activeThreadId === id) handleNewChat();
          toast.success("Conversation deleted");
        } catch {
          toast.error("Failed to delete conversation");
        }
      },
    });
  };

  // Clear all chats with confirmation modal
  const handleClearAllChats = () => {
    setConfirmModal({
      open: true,
      title: "Clear all conversations?",
      message: "All your conversations will be permanently deleted. This cannot be undone.",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        try {
          toast.loading("Clearing conversations…", { id: "clearall" });
          await deleteUserChats();
          setThreads([]);
          handleNewChat();
          toast.success("All conversations cleared", { id: "clearall" });
        } catch {
          toast.error("Failed to clear conversations", { id: "clearall" });
        }
      },
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      toast.loading("Updating profile…", { id: "profile" });
      const updated = await updateUserProfile({
        name: profileName,
        email: profileEmail,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      if (auth) {
        auth.setUser({ name: updated.name, email: updated.email });
      }
      setCurrentPassword("");
      setNewPassword("");
      setShowSettings(false);
      toast.success("Profile updated successfully!", { id: "profile" });
    } catch (err: any) {
      const msg = err.response?.data || "Update failed";
      toast.error(msg, { id: "profile" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const initial = auth?.user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside
        className={`sidebar glow-card ${isMobileSidebarOpen ? "open" : ""} ${!isSidebarOpen ? "desktop-hidden" : ""}`}
        style={{ borderRight: "1px solid var(--border-strong)" }}
      >
        <div className="sidebar-header" style={{ padding: "12px 16px" }}>
          <button
            onClick={handleNewChat}
            className="btn glow-button"
            style={{ width: "100%", height: "40px", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}
          >
            <FiPlus size={16} /> New Chat
          </button>
        </div>

        <div className="sidebar-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Conversations</span>
        </div>

        <div
          className="threads-list"
          style={{ flexGrow: 1, overflowY: "auto", padding: "0 8px 12px", display: "flex", flexDirection: "column", gap: "4px" }}
        >
          {threads.length === 0 ? (
            <div style={{ padding: "20px 12px", fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
              No chat history
            </div>
          ) : (
            threads.map((t) => {
              const isActive = activeThreadId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectThread(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: isActive ? "rgba(0, 240, 255, 0.08)" : "transparent",
                    border: isActive ? "1px solid var(--neon-blue)" : "1px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  className={isActive ? "glow-text" : ""}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden", flex: 1 }}>
                    <span style={{ display: "flex", alignItems: "center", color: isActive ? "var(--neon-blue)" : "var(--text-muted)" }}>
                      <FiMessageSquare size={14} />
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 450,
                        color: isActive ? "var(--neon-blue)" : "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteThread(e, t.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "13px",
                      padding: "4px",
                      borderRadius: "4px",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    title="Delete Conversation"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="sidebar-footer" style={{ borderTop: "1px solid var(--border-strong)" }}>
          <div
            onClick={() => { setShowSettings(true); setIsMobileSidebarOpen(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              padding: "10px 12px",
              background: "var(--bg-surface-2)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--neon-blue)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>
              {initial}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {auth?.user?.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Profile Settings <FiSettings size={10} style={{ display: "inline", verticalAlign: "middle" }} />
              </div>
            </div>
          </div>
          <button className="sidebar-clear-btn" onClick={handleClearAllChats}>
            <FiTrash2 size={13} /> Clear all conversations
          </button>
        </div>
      </aside>

      {/* Main chat panel */}
      <div className="chat-panel" onClick={() => setIsMobileSidebarOpen(false)}>
        {/* Top bar — desktop sidebar toggle + mobile menu toggle */}
        <div className="chat-topbar">
          {/* Desktop sidebar toggle */}
          <button
            className="btn btn-ghost chat-sidebar-toggle"
            onClick={(e) => { e.stopPropagation(); setIsSidebarOpen((p) => !p); }}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FiSidebar size={18} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsMobileSidebarOpen((prev) => !prev); }}
            className="btn btn-ghost mobile-header-toggle"
            style={{ display: "none" }}
          >
            {isMobileSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <span className="chat-topbar-title">
            {activeThreadId
              ? (threads.find((t) => t.id === activeThreadId)?.title ?? "CipherGPT")
              : "CipherGPT"}
          </span>
        </div>

        {/* Thread loading skeleton */}
        {isThreadLoading ? (
          <div className="chat-messages" style={{ paddingTop: 24 }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={`message-row ${n % 2 === 0 ? "user-message" : "ai-message"}`} style={{ opacity: 0.5 }}>
                <div className="message-content-wrap">
                  <div className="message-header">
                    <div className={`msg-avatar ${n % 2 === 0 ? "msg-avatar-user" : "msg-avatar-ai"}`}
                      style={{ background: "var(--bg-surface-3)" }} />
                    <div style={{ height: 10, width: 80, background: "var(--bg-surface-3)", borderRadius: 4, animation: "pulse-dot 1.5s infinite" }} />
                  </div>
                  <div className="message-body" style={{ paddingLeft: 38 }}>
                    <div style={{ height: 10, width: `${55 + n * 12}%`, background: "var(--bg-surface-3)", borderRadius: 4, marginBottom: 8, animation: "pulse-dot 1.5s infinite" }} />
                    <div style={{ height: 10, width: `${30 + n * 8}%`, background: "var(--bg-surface-3)", borderRadius: 4, animation: "pulse-dot 1.5s infinite" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : chatMessages.length === 0 && !isLoading && !activeThreadId ? (
          <div className="chat-empty">
            <div className="chat-empty-icon glow-border" style={{ animation: "pulse-dot 2.5s infinite", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiCpu size={20} />
            </div>
            <div>
              <h2 className="chat-empty-title">
                What can I help you <span className="glow-text">build today?</span>
              </h2>
              <p className="chat-empty-sub" style={{ marginTop: 8 }}>
                Explore prompts, code templates, or ask specific questions.
              </p>
            </div>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} className="chat-suggestion-card" onClick={() => handleSubmit(s)} style={{ borderLeft: "3px solid var(--neon-blue)" }}>
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="chat-messages"
            ref={messagesContainerRef}
            onScroll={handleScroll}
            style={{ position: "relative" }}
          >
            {chatMessages.map((msg, i) => (
              <ChatItem
                key={i}
                role={msg.role}
                content={msg.content}
                isLatest={!!msg.isNew}
              />
            ))}
            {isLoading && (
              <div className="message-row ai-message">
                <div className="message-content-wrap">
                  <div className="message-header">
                    <div className="msg-avatar msg-avatar-ai">
                      <FiCpu size={14} />
                    </div>
                    <span className="msg-sender">CipherGPT</span>
                  </div>
                  <div className="message-body" style={{ paddingLeft: 38 }}>
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Floating scroll to bottom button */}
        {showScrollButton && (
          <button
            className="scroll-bottom-btn"
            onClick={scrollToBottomDirect}
            title="Scroll to bottom"
          >
            <FiArrowDown size={18} />
          </button>
        )}

        {/* Input area */}
        <div className="chat-input-container" style={{ borderTop: "1px solid var(--border-strong)" }}>
          {/* Attached file chips */}
          {attachedFiles.length > 0 && (
            <div className="chat-attachments">
              {attachedFiles.map((af, idx) => (
                <div
                  key={idx}
                  className="chat-attachment-chip"
                  style={{
                    borderColor:
                      af.status === "error"
                        ? "rgba(248,113,113,0.4)"
                        : af.status === "ready"
                        ? "rgba(0,240,255,0.3)"
                        : "var(--border)",
                  }}
                >
                  {/* Thumbnail for images */}
                  {af.type === "image" && af.previewUrl ? (
                    <img
                      src={af.previewUrl}
                      alt={af.name}
                      style={{ width: 22, height: 22, objectFit: "cover", borderRadius: 3, flexShrink: 0 }}
                    />
                  ) : af.status === "processing" ? (
                    <FiLoader size={13} style={{ flexShrink: 0, animation: "spin 1s linear infinite", color: "var(--neon-blue)" }} />
                  ) : af.status === "error" ? (
                    <FiAlertCircle size={13} style={{ flexShrink: 0, color: "var(--error)" }} />
                  ) : af.type === "pdf" ? (
                    <FiFile size={13} style={{ flexShrink: 0, color: "var(--neon-blue)" }} />
                  ) : (
                    <FiImage size={13} style={{ flexShrink: 0 }} />
                  )}

                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                      {af.name.length > 22 ? af.name.slice(0, 20) + "…" : af.name}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1 }}>
                      {af.status === "processing"
                        ? "Reading…"
                        : af.status === "error"
                        ? af.errorMsg
                        : af.type === "pdf" && af.extractedText
                        ? `${af.size} · ${af.extractedText.split(" ").length.toLocaleString()} words extracted`
                        : af.size}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveAttachment(idx)}
                    title="Remove"
                    disabled={af.status === "processing"}
                  >
                    <FiX size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="chat-input-wrap">
            {/* Left toolbar */}
            <div className="chat-input-toolbar">
              {/* Attach file button */}
              <button
                className="chat-toolbar-btn"
                title="Attach image or PDF"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiPaperclip size={17} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                style={{ display: "none" }}
                onChange={handleFileAttach}
              />

              {/* Web search button */}
              <button
                className="chat-toolbar-btn"
                title="Search the web"
                onClick={() => {
                  if (inputRef.current && !inputRef.current.value.trim()) {
                    inputRef.current.focus();
                    toast("Type your search query, then press Enter", { icon: "🔍" });
                  } else {
                    handleSubmit(`Search the web for: ${inputRef.current?.value.trim()}`);
                  }
                }}
              >
                <FiSearch size={17} />
              </button>
            </div>

            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Message CipherGPT… (Enter to send, Shift+Enter for new line)"
              rows={1}
              autoComplete="off"
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 200) + "px";
              }}
            />

            {/* Send / Stop button */}
            {isLoading ? (
              <button
                className="chat-send-btn"
                onClick={handleStopResponse}
                title="Stop generating"
                style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)", color: "var(--error)" }}
              >
                <FiSquare size={15} />
              </button>
            ) : (
              <button
                className="chat-send-btn glow-button"
                onClick={() => handleSubmit()}
                title="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            )}
          </div>
          <p className="chat-input-hint">
            CipherGPT can make mistakes. Verify important information.
          </p>
        </div>
      </div>

      {/* Settings / Profile Modal */}
      {showSettings && (
        <div
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, backdropFilter: "blur(4px)" }}
        >
          <div className="auth-card glow-card" style={{ width: "100%", maxWidth: "480px", padding: "32px", boxShadow: "0 0 30px rgba(0,240,255,0.25)" }}>
            <div className="auth-logo-area" style={{ marginBottom: 24 }}>
              <h2 className="auth-title glow-text" style={{ fontSize: "22px" }}>Profile Settings</h2>
              <p className="auth-subtitle">Update your personal account credentials</p>
            </div>
            <form onSubmit={handleSaveProfile} className="auth-form" autoComplete="off">
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input type="text" className="auth-input" value={profileName} onChange={(e) => setProfileName(e.target.value)} required autoComplete="off" />
              </div>
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input type="email" className="auth-input" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} required autoComplete="off" />
              </div>
              <div style={{ margin: "8px 0", borderBottom: "1px solid var(--border)" }} />
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>
                Fill fields below only if you want to change your password:
              </p>
              <div className="auth-field">
                <label className="auth-label">Current Password</label>
                <input type="password" className="auth-input" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="new-password" />
              </div>
              <div className="auth-field">
                <label className="auth-label">New Password</label>
                <input type="password" className="auth-input" placeholder="At least 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} autoComplete="new-password" />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowSettings(false)} disabled={isSavingProfile}>Cancel</button>
                <button type="submit" className="btn glow-button" style={{ flex: 1, padding: "10px" }} disabled={isSavingProfile}>
                  {isSavingProfile ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmModal.open && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        />
      )}
    </div>
  );
};

export default Chat;
