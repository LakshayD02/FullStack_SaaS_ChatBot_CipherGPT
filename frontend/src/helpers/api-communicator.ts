import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  return res.data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  return res.data;
};

// Chat Sessions and Threads
export const sendChatRequest = async (message: string, threadId?: string, signal?: AbortSignal) => {
  const res = await axios.post("/chat/new", { message, threadId }, { signal });
  if (res.status !== 200) {
    throw new Error("Unable to send chat");
  }
  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to fetch chats");
  }
  return res.data;
};

export const getThreadMessages = async (threadId: string) => {
  const res = await axios.get(`/chat/thread/${threadId}`);
  if (res.status !== 200) {
    throw new Error("Unable to fetch thread messages");
  }
  return res.data;
};

export const deleteUserThread = async (threadId: string) => {
  const res = await axios.delete(`/chat/thread/${threadId}`);
  if (res.status !== 200) {
    throw new Error("Unable to delete thread");
  }
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  return res.data;
};

// Profile & Forgot Password
export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  // Let axios throw on non-2xx so the caller gets err.response.data
  const res = await axios.put("/user/update-profile", data);
  return res.data;
};

export const requestPasswordOTP = async (email: string) => {
  const res = await axios.post("/user/send-otp", { email });
  if (res.status !== 200) {
    throw new Error("Unable to send OTP");
  }
  return res.data;
};

export const resetPassword = async (data: {
  email: string;
  otp: string;
  newPassword?: string;
}) => {
  const res = await axios.post("/user/reset-password", data);
  if (res.status !== 200) {
    throw new Error("Unable to reset password");
  }
  return res.data;
};
