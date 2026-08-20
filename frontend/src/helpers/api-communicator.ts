import axios from "axios";

const TOKEN_KEY = "ciphergpt_token";

// ─── Token Helpers ─────────────────────────────────────────────────────────

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common["Authorization"];
};

export const restoreAuthToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return token;
};

// ─── Run immediately on import (synchronous) ───────────────────────────────
// Guarantees the Authorization header is set BEFORE any component renders
// or makes an API call, eliminating race conditions with useLayoutEffect.
restoreAuthToken();

// ─── Axios request interceptor (safety net) ────────────────────────────────
// Sends the token in BOTH headers on every request.
// x-auth-token is a custom header that survives Vercel's proxy/CDN layer
// even in cases where the standard Authorization header gets stripped.
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["x-auth-token"] = token;
  }
  return config;
});

// ─── Auth ──────────────────────────────────────────────────────────────────

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) throw new Error("Unable to login");
  if (res.data.token) setAuthToken(res.data.token);
  return res.data;
};

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201) throw new Error("Unable to Signup");
  if (res.data.token) setAuthToken(res.data.token);
  return res.data;
};

export const checkAuthStatus = async () => {
  const token = restoreAuthToken();
  if (!token) return null;
  try {
    const res = await axios.get("/user/auth-status");
    if (res.status !== 200) return null;
    return res.data;
  } catch (err: any) {
    // Only clear token if the backend explicitly rejects it (401 = expired/invalid).
    // Network errors, 5xx, or timeouts must NOT wipe the stored token —
    // that would log the user out on every refresh when the backend is slow.
    if (err?.response?.status === 401) {
      clearAuthToken();
    }
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await axios.get("/user/logout");
  } catch {
    // ignore logout errors
  } finally {
    clearAuthToken();
  }
};

// ─── Chat Sessions and Threads ─────────────────────────────────────────────

export const sendChatRequest = async (message: string, threadId?: string, signal?: AbortSignal) => {
  const res = await axios.post("/chat/new", { message, threadId }, { signal });
  if (res.status !== 200) throw new Error("Unable to send chat");
  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) throw new Error("Unable to fetch chats");
  return res.data;
};

export const getThreadMessages = async (threadId: string) => {
  const res = await axios.get(`/chat/thread/${threadId}`);
  if (res.status !== 200) throw new Error("Unable to fetch thread messages");
  return res.data;
};

export const deleteUserThread = async (threadId: string) => {
  const res = await axios.delete(`/chat/thread/${threadId}`);
  if (res.status !== 200) throw new Error("Unable to delete thread");
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) throw new Error("Unable to delete chats");
  return res.data;
};

// ─── Profile & Forgot Password ─────────────────────────────────────────────

export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  const res = await axios.put("/user/update-profile", data);
  return res.data;
};

export const requestPasswordOTP = async (email: string) => {
  const res = await axios.post("/user/send-otp", { email });
  if (res.status !== 200) throw new Error("Unable to send OTP");
  return res.data;
};

export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword?: string;
}) => {
  const res = await axios.post("/user/reset-password", data);
  if (res.status !== 200) throw new Error("Unable to reset password");
  return res.data;
};
