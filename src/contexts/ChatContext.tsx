import React, { createContext, useContext, useState, useCallback } from "react";
import * as chatService from "../services/chat.service";
import { ChatMode, Session } from "../types/chat.type";

interface ChatContextType {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  activeMode: ChatMode;
  setActiveMode: (mode: ChatMode) => void;
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  loading: boolean;
  createSession: (mode: ChatMode) => Promise<Session>;
  fetchSessions: () => Promise<void>;
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<ChatMode>("map");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatService.getSessionsList();
      setSessions(response.data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = async (mode: ChatMode): Promise<Session> => {
    try {
      setLoading(true);
      const response = await chatService.createSession(mode);
      const newSession = response.data;
      setSessions((prev) => [newSession, ...prev]);
      setActiveChatId(newSession.id);
      setActiveMode(mode);
      return newSession;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        activeChatId,
        setActiveChatId,
        activeMode,
        setActiveMode,
        sessions,
        setSessions,
        loading,
        createSession,
        fetchSessions,
        currentSession,
        setCurrentSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
