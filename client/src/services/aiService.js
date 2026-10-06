import { postRequest } from "./api";

export const chatWithAI = async (message, book = null) => {
  const response = await postRequest("/ai/chat", {
    message,
    book,
  });

  return response.data;
}