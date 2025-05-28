import { apiClient } from "./auth.service";
import authHeader from "./auth-header";
import { ChatMode, Message, Session } from "../types/chat.type";

export const createSession = async (mode: ChatMode) => {
  const response = await apiClient.post("/functions/v1/session", { mode });
  return response.data;
};

export const completeSession = async (sessionId: string, summary: string) => {
  const response = await apiClient.put(
    `/functions/v1/session/${sessionId}/complete`,
    { summary }
  );
  return response.data;
};

export const getSessionMessages = async (sessionId: string) => {
  const response = await apiClient.get(
    `/rest/v1/message?sessionId=eq.${sessionId}&limit=10&order=createdAt.desc`,
    { headers: authHeader() }
  );
  return response.data;
};

export const sendMessage = async (
  mode: ChatMode,
  sessionId: string,
  question: string
) => {
  const response = await apiClient.post(`/functions/v1/companion/${mode}`, {
    sessionId,
    question,
  });
  return response.data;
};

export const getIntro = async (mode: ChatMode, sessionId: string) => {
  const response = await apiClient.post(
    `/functions/v1/companion/${mode}/intro`,
    { sessionId }
  );
  return response.data;
};

export const getSessionsList = async (): Promise<{ data: Session[] }> => {
  // Try the faster REST endpoint first
  try {
    const response = await apiClient.get("/rest/v1/session", {
      headers: authHeader(),
    });
    return { data: response.data };
  } catch (error) {
    // Fallback to Functions endpoint if REST fails
    const response = await apiClient.get("/functions/v1/session");
    return response.data;
  }
};
