import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../contexts/ChatContext";
import { Message } from "../../types/chat.type";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import InputArea from "./components/InputArea";
import * as chatService from "../../services/chat.service";
import "../../assets/css/Chat.css";
import { useNavigate } from "react-router-dom";

export const InnerMapPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();
  const { setActiveMode, currentSession, setCurrentSession } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveMode("map");
  }, [setActiveMode]);

  // XÓA ĐOẠN CODE NÀY - đã được xử lý ở App.tsx
  // useEffect(() => {
  //   if (!currentUser) {
  //     navigate("/login");
  //   }
  // }, [currentUser, navigate]);

  const startNewSession = async () => {
    try {
      setLoading(true);
      const session = await chatService.createSession("map");
      setCurrentSession(session);
      const intro = await chatService.getIntro("map", session.id);

      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        sessionId: session.id,
        text: intro.message || "Bạn đang chat với InnerMap",
        type: "received",
        time: new Date().toLocaleTimeString(),
        hasAvatar: true,
        timestamp: Date.now(),
      };

      setMessages([systemMessage]);
    } catch (error) {
      console.error(error);
      setError("Failed to start new session");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!currentSession) {
      await startNewSession();
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sessionId: currentSession.id,
      text,
      type: "sent",
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(
        "map",
        currentSession.id,
        text
      );

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sessionId: currentSession.id,
        text: response.message,
        type: "received",
        time: new Date().toLocaleTimeString(),
        hasAvatar: true,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // AuthService.logout();
    navigate("/login");
  };

  const userEmail = currentUser?.email || "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  const hasOnlySystemMessage =
    messages.length === 1 && messages[0]?.id.startsWith("system-");

  return (
    <div className="main-chat-container">
      <Sidebar />
      <div className="main-chat">
        <Header />

        <ChatArea
          ref={chatAreaRef}
          messages={messages}
          loading={loading}
          hasOnlySystemMessage={hasOnlySystemMessage}
          onStartChat={startNewSession}
        />
        <InputArea onSendMessage={handleSendMessage} isLoading={loading} />
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
};
