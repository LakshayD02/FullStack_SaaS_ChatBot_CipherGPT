import OpenAI from "openai";

export const configureOpenAI = () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://ciphergpt-lakshay.vercel.app",
      "X-Title": "CipherGPT",
    },
  });
  return openai;
};
