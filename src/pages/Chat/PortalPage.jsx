import React, { useRef, useEffect, useState } from "react";
import "./../Chat.css";
import Sidebar from "./../components/Sidebar";
import ChatArea from "./../components/ChatArea";
import InputArea from "./../components/InputArea";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PortalPage() {
  const {
    messages,
    loading: chatLoading,
    error,
    sendMessage,
    setError,
    setActiveMode,
    createSession,
  } = useChat();
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  const navigate = useNavigate();
  const chatAreaRef = useRef(null);
  const [localMessages, setLocalMessages] = useState(messages);

  // Sync localMessages with context messages
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Set mode to "portal" on mount
  useEffect(() => {
    setActiveMode("portal");
  }, [setActiveMode]);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  const handleSendMessage = (message) => {
    if (message.trim() !== "") {
      sendMessage(message, "portal");
      // Filter out system message when user sends a message
      setLocalMessages((prevMessages) =>
        prevMessages.filter((msg) => !msg.id.startsWith("system-"))
      );
    }
  };

  const dismissError = () => {
    setError(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userEmail = user?.email || "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  const handleStartChat = async () => {
    if (!localMessages.length && !chatLoading) {
      const result = await createSession("portal");
      if (result.success) {
        const systemMessage = {
          id: `system-${Date.now()}`,
          text: "Bạn đang chat với Possibility Portal",
          type: "received",
          time: new Date().toLocaleTimeString(),
          hasAvatar: true,
          timestamp: Date.now(),
        };
        setLocalMessages([systemMessage]);
      }
    }
  };

  // Check if there are only system messages (no user messages)
  const hasOnlySystemMessage =
    localMessages.length === 1 && localMessages[0].id.startsWith("system-");

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="main-chat-container">
        <Sidebar />
        <div className="main-chat">
          <div className="header">
            <div className="mode-selector">
              <div className="dropdown-button" title="Possibility Portal mode">
                <span className="section-heading">Possibility Portal</span>
              </div>
            </div>
            <div className="user-profile">
              <div className="user-name">{userEmail}</div>
              <div
                className="profile-pic"
                title="Click to logout"
                onClick={handleLogout}
              >
                {userInitial}
              </div>
            </div>
          </div>
          <ChatArea
            messages={localMessages}
            loading={chatLoading}
            ref={chatAreaRef}
            hasOnlySystemMessage={hasOnlySystemMessage}
            onStartChat={handleStartChat}
          />
          <InputArea
            onSendMessage={handleSendMessage}
            isLoading={chatLoading}
          />
          {error && (
            <div className="error-message">
              {error}
              <button onClick={dismissError}>Dismiss</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PortalPage;
