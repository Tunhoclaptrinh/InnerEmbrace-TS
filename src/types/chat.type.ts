export type ChatMode = "map" | "imaginary" | "portal";

export interface Message {
  id: string;
  sessionId: string;
  text: string;
  type: "sent" | "received";
  time: string;
  hasAvatar?: boolean;
  timestamp: number;
}

export interface Session {
  id: string;
  mode: ChatMode;
  createdAt: string;
  summary?: string;
  isCompleted: boolean;
}

export interface ChatContextType {
  activeMode: ChatMode;
  setActiveMode: (mode: ChatMode) => void;
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void;
}
