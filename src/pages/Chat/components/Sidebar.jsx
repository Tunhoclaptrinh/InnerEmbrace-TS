import React, { useEffect } from "react";
import logo from "../../../assets/img/Logo_chat.png";
import { useChat } from "../../../contexts/ChatContext";
import "../../../assets/themify-icons-master/css/themify-icons.css";

const Sidebar = () => {
  const {
    activeChatId,
    setActiveChatId,
    setActiveMode,
    sessions,
    createSession,
    loading,
    fetchSessions,
  } = useChat();

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Select the most recent session if activeChatId is null
  useEffect(() => {
    if (!activeChatId && sessions.length > 0) {
      const mostRecentSession = [...sessions].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      })[0];
      setActiveChatId(mostRecentSession.id);
      setActiveMode(mostRecentSession.mode);
    }
  }, [activeChatId, sessions, setActiveChatId, setActiveMode]);

  const handleChatClick = (sessionId) => {
    if (sessionId !== activeChatId) {
      setActiveChatId(sessionId);
      const selectedSession = sessions.find(
        (session) => session.id === sessionId
      );
      if (selectedSession) {
        setActiveMode(selectedSession.mode);
      }
    }
  };

  const handleCreateNewChat = async () => {
    try {
      const result = await createSession("map");
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleRefreshSessions = () => {
    fetchSessions();
  };

  // Group sessions by date
  const groupSessionsByDate = () => {
    const groups = {};

    if (!sessions || !sessions.length) return {};

    sessions.forEach((session) => {
      if (!session || (!session.created_at && !session.createdAt)) {
        return;
      }

      const date = new Date(session.created_at || session.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupName;

      if (date.toDateString() === today.toDateString()) {
        groupName = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupName = "Yesterday";
      } else {
        groupName = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });
      }

      if (!groups[groupName]) {
        groups[groupName] = [];
      }

      groups[groupName].push(session);
    });

    // Sort sessions within each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      });
    });

    return groups;
  };

  // Format mode name for display
  const formatModeName = (mode) => {
    switch (mode) {
      case "map":
        return "Inner Map";
      case "imaginary":
        return "Imaginary";
      case "portal":
        return "Portal";
      default:
        return mode;
    }
  };

  const sessionGroups = groupSessionsByDate();
  const isEmptySidebar = Object.keys(sessionGroups).length === 0;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={logo} alt="Inner Map Logo" className="logo" />
          <div className="sidebar-name">
            <span className="sidebar-title section-heading">Inner Map</span>
            <div className="sidebar-icons">
              <span
                className="icon"
                onClick={handleCreateNewChat}
                title="Create new chat"
              >
                <i className="ti-pencil"></i>
              </span>
              <span
                className="icon"
                onClick={handleRefreshSessions}
                title="Refresh sessions"
              >
                <i className="ti-reload"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-content" style={{ marginLeft: 28 }}>
          Loading sessions...
        </div>
      )}

      {!loading && isEmptySidebar && (
        <div className="p-content empty-state">
          No chat sessions available.
          <button onClick={handleCreateNewChat} className="create-session-btn">
            Create your first chat
          </button>
        </div>
      )}

      {Object.entries(sessionGroups).map(([groupName, groupSessions]) => (
        <React.Fragment key={groupName}>
          <div className="timestamp p-content">{groupName}</div>
          <div className="chat-list">
            {groupSessions.map((session) => (
              <div
                key={session.id}
                className={`chat-item ${
                  session.status === "finished" ? "finished-chat" : ""
                } ${activeChatId === session.id ? "active-chat" : ""}`}
                onClick={() => handleChatClick(session.id)}
              >
                <span
                  className={`chat-status ${
                    session.status === "active" ? "chatting" : "finished-status"
                  }`}
                >
                  {session.status === "active" ? "Chatting" : "Finished"}
                </span>
                <div className="chat-title-container">
                  <div className="chat-title">
                    {session.summary ||
                      session.title ||
                      `Chat ${new Date(
                        session.createdAt || session.created_at
                      ).toLocaleTimeString()}`}
                  </div>
                  <div className="chat-mode p-content">
                    Mode: {formatModeName(session.mode)}
                  </div>
                  <div className="chat-timestamp p-content">
                    {new Date(
                      session.createdAt || session.created_at
                    ).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}

      <div className="upgrade-btn-container">
        <button className="upgrade-btn">Upgrade Your Package</button>
      </div>
      <style jsx>{`
        .chat-title-container {
          display: flex;
          flex-direction: column;
        }
        .chat-title {
          font-weight: 500;
          color: #333;
        }
        .chat-mode {
          font-size: 1.2em;
          color: #4e73df;
          font-weight: 500;
          margin-top: 4px;
        }
        .chat-timestamp {
          font-size: 0.8em;
          color: #666;
          margin-top: 4px;
        }
        .chat-item {
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .chat-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .active-chat {
          background-color: rgba(78, 115, 223, 0.1);
          border-left: 3px solid #4e73df;
        }
        .finished-chat {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
