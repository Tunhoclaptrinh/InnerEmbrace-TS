// import React, { useState, useRef, useEffect } from "react";
// import { useAuth } from "../../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useChat } from "../../../context/ChatContext";

// const Header = () => {
//   const { user, logout } = useAuth();
//   const { activeMode, setActiveMode, createSession } = useChat();
//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Mode options
//   const modes = [
//     { id: "map", name: "Inner Map" },
//     { id: "imaginary", name: "Imaginary" },
//     { id: "portal", name: "Portal" },
//   ];

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleModeChange = async (mode) => {
//     if (mode !== activeMode) {
//       setActiveMode(mode);
//       // Create a new session with the selected mode
//       try {
//         await createSession(mode);
//       } catch (error) {
//         console.error("Error creating session with new mode:", error);
//       }
//     }
//     setIsDropdownOpen(false);
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const userEmail = user?.email || "User";
//   const userInitial = userEmail.charAt(0).toUpperCase();

//   // Find current mode name
//   const currentModeName =
//     modes.find((mode) => mode.id === activeMode)?.name || "Inner Map";

//   return (
//     <div className="header">
//       <div className="mode-selector dropdown" ref={dropdownRef}>
//         <div
//           className="dropdown-button"
//           onClick={toggleDropdown}
//           title="Select companion mode"
//         >
//           <span>{currentModeName}</span>
//           <i className="ti ti-angle-down"></i>
//         </div>
//         {isDropdownOpen && (
//           <div className="dropdown-menu">
//             {modes.map((mode) => (
//               <div
//                 key={mode.id}
//                 className={`dropdown-item ${
//                   activeMode === mode.id ? "active" : ""
//                 }`}
//                 onClick={() => handleModeChange(mode.id)}
//               >
//                 {mode.name}
//                 {activeMode === mode.id && <i className="ti ti-check"></i>}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <div className="user-profile">
//         <div className="user-name">{userEmail}</div>
//         <div
//           className="profile-pic"
//           title="Click to logout"
//           onClick={handleLogout}
//         >
//           {userInitial}
//         </div>
//       </div>

//       <style jsx>{`
//         .mode-selector {
//           position: relative;
//         }

//         .dropdown-button {
//           display: flex;
//           align-items: center;
//           cursor: pointer;
//           font-weight: 600;
//           gap: 8px;
//           padding: 8px 12px;
//           border-radius: 6px;
//           transition: background-color 0.2s;
//         }

//         .dropdown-button:hover {
//           background-color: rgba(0, 0, 0, 0.05);
//         }

//         .dropdown-menu {
//           position: absolute;
//           top: 100%;
//           left: 0;
//           width: 180px;
//           background-color: white;
//           border-radius: 8px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//           overflow: hidden;
//           z-index: 10;
//         }

//         .dropdown-item {
//           padding: 12px 16px;
//           cursor: pointer;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           transition: background-color 0.2s;
//         }

//         .dropdown-item:hover {
//           background-color: rgba(0, 0, 0, 0.05);
//         }

//         .dropdown-item.active {
//           background-color: rgba(78, 115, 223, 0.1);
//           color: #4e73df;
//           font-weight: 600;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Header;
import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/Chat.css";

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const userEmail = currentUser?.email || "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="chat-header">
      <div className="mode-selector">
        <div className="dropdown-button" title="Inner Map mode">
          <span className="section-heading">Inner Map</span>
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
  );
};

export default Header;
