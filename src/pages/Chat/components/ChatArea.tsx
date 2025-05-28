import React, { forwardRef } from "react";
import LoadingIndicator from "./LoadingIndicator";
import { useChat } from "../../../contexts/ChatContext";
import { Message } from "../../../types/chat.type";
import "../../../assets/css/Chat.css";

interface ChatAreaProps {
  messages: Message[];
  loading: boolean;
  hasOnlySystemMessage: boolean;
  onStartChat: () => void;
}

const ChatArea = forwardRef<HTMLDivElement, ChatAreaProps>(
  ({ messages, loading, hasOnlySystemMessage, onStartChat }, ref) => {
    const { activeMode } = useChat();
    const safeMessages = Array.isArray(messages) ? messages : [];

    // Get welcome message based on the active mode
    const getWelcomeMessage = () => {
      switch (activeMode) {
        case "map":
          return {
            title: "Chào Mừng Bạn Đến Với Inner Map",
            description: "Nơi bạn có thể trải lòng và tìm sự thấu hiểu",
          };
        case "imaginary":
          return {
            title: "Chào Mừng Bạn Đến Với Imaginary Coaching",
            description:
              "Nơi bạn có thể trò chuyện với người bạn tưởng tượng của mình",
          };
        case "portal":
          return {
            title: "Chào Mừng Bạn Đến Với Possibility Portal",
            description:
              "Nơi bạn có thể khám phá những góc nhìn và ý tưởng mới",
          };
        default:
          return {
            title: "Welcome",
            description: "Start a new conversation by typing a message below.",
          };
      }
    };

    if (safeMessages.length === 0 && !loading) {
      const welcome = getWelcomeMessage();
      return (
        <div className="chat-area empty-chat" ref={ref}>
          <div className={`empty-chat-message ${activeMode}`}>
            <h3>{welcome.title}</h3>
            <p>{welcome.description}</p>
            <button className="start-button" onClick={onStartChat}>
              Tôi Đã Sẵn Sàng Để Bắt Đầu
            </button>
          </div>
        </div>
      );
    }

    if (hasOnlySystemMessage && !loading) {
      return (
        <div className="chat-area" ref={ref}>
          {safeMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={`message-container ${message.type}`}
            >
              <div
                className={
                  message.type === "sent"
                    ? "message-sent p-content"
                    : "message p-content"
                }
              >
                {message.text}
                {message.hasAvatar && (
                  <div className={`avatar ${activeMode}-mode-indicator`}>
                    {activeMode === "map"
                      ? "🧠"
                      : activeMode === "imaginary"
                      ? "👤"
                      : "🌐"}
                  </div>
                )}
              </div>
              <div
                className={
                  message.type === "sent"
                    ? "message-time-right"
                    : "message-time-left"
                }
              >
                {message.time || new Date().toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="chat-area" ref={ref}>
        {safeMessages.map((message, index) => (
          <div
            key={message.id || index}
            className={`message-container ${message.type}`}
          >
            <div
              className={
                message.type === "sent"
                  ? "message-sent p-content"
                  : "message p-content"
              }
            >
              {message.text}
              {message.hasAvatar && (
                <div className={`avatar ${activeMode}-mode-indicator`}>
                  {activeMode === "map"
                    ? "🧠"
                    : activeMode === "imaginary"
                    ? "👤"
                    : "🌐"}
                </div>
              )}
            </div>
            <div
              className={
                message.type === "sent"
                  ? "message-time-right"
                  : "message-time-left"
              }
            >
              {message.time || new Date().toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && <LoadingIndicator />}
      </div>
    );
  }
);

export default ChatArea;
