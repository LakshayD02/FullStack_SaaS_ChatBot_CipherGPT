import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "../../context/AuthContext";
import { FiCpu } from "react-icons/fi";

type Props = {
  role: "user" | "assistant";
  content: string;
  isLatest?: boolean;
};

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{language || "code"}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", background: "#1a1a22" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const ChatItem = ({ role, content, isLatest = false }: Props) => {
  const auth = useAuth();
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const isUser = role === "user";

  // Typing animation for new AI responses
  useEffect(() => {
    if (!isUser && isLatest && content) {
      setDisplayedContent("");
      let currentIndex = 0;
      const interval = setInterval(() => {
        currentIndex += 4;
        if (currentIndex >= content.length) {
          setDisplayedContent(content);
          clearInterval(interval);
        } else {
          setDisplayedContent(content.slice(0, currentIndex));
        }
      }, 12);
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(content);
    }
  }, [content, isLatest, isUser]);

  const initial = auth?.user?.name?.[0]?.toUpperCase() ?? "U";

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`message-row ${isUser ? "user-message" : "ai-message"}`}>
      <div className="message-content-wrap">
        <div className="message-header">
          <div className={`msg-avatar ${isUser ? "msg-avatar-user" : "msg-avatar-ai"}`}>
            {isUser ? initial : <FiCpu size={14} />}
          </div>
          <span className="msg-sender">{isUser ? "You" : "CipherGPT"}</span>
        </div>

        <div className="message-body">
          {isUser ? (
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{displayedContent}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeStr = String(children).replace(/\n$/, "");
                  if (!inline) {
                    return <CodeBlock language={match ? match[1] : ""} code={codeStr} />;
                  }
                  return (
                    <code
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: "0.875em",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table({ children }) {
                  return (
                    <div style={{ overflowX: "auto", margin: "12px 0" }}>
                      <table
                        style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {children}
                      </table>
                    </div>
                  );
                },
                thead({ children }) {
                  return (
                    <thead style={{ background: "var(--bg-surface-2)" }}>{children}</thead>
                  );
                },
                th({ children }) {
                  return (
                    <th
                      style={{
                        border: "1px solid var(--border-strong)",
                        padding: "8px 14px",
                        textAlign: "left",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td
                      style={{
                        border: "1px solid var(--border)",
                        padding: "8px 14px",
                        color: "var(--text-secondary)",
                        verticalAlign: "top",
                      }}
                    >
                      {children}
                    </td>
                  );
                },
                tr({ children }) {
                  return (
                    <tr
                      style={{
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "transparent")
                      }
                    >
                      {children}
                    </tr>
                  );
                },
                p({ children }) {
                  return <p style={{ margin: "6px 0", lineHeight: 1.7 }}>{children}</p>;
                },
                ul({ children }) {
                  return <ul style={{ paddingLeft: 20, margin: "8px 0" }}>{children}</ul>;
                },
                ol({ children }) {
                  return <ol style={{ paddingLeft: 20, margin: "8px 0" }}>{children}</ol>;
                },
                li({ children }) {
                  return <li style={{ marginBottom: 4, lineHeight: 1.6 }}>{children}</li>;
                },
                h1({ children }) {
                  return <h1 style={{ fontSize: 22, fontWeight: 800, margin: "16px 0 8px" }}>{children}</h1>;
                },
                h2({ children }) {
                  return <h2 style={{ fontSize: 18, fontWeight: 700, margin: "14px 0 6px" }}>{children}</h2>;
                },
                h3({ children }) {
                  return <h3 style={{ fontSize: 16, fontWeight: 700, margin: "12px 0 4px" }}>{children}</h3>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote
                      style={{
                        borderLeft: "3px solid var(--neon-blue)",
                        paddingLeft: 14,
                        margin: "10px 0",
                        color: "var(--text-secondary)",
                        fontStyle: "italic",
                      }}
                    >
                      {children}
                    </blockquote>
                  );
                },
                hr() {
                  return <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />;
                },
              }}
            >
              {displayedContent}
            </ReactMarkdown>
          )}
        </div>

        <div className="message-actions">
          <button className="message-action-btn" onClick={handleCopy}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
