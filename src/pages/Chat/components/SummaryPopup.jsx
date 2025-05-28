import React, { useState } from "react";

const SummaryPopup = ({ isOpen, onClose, onSubmit }) => {
  const [summary, setSummary] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (summary.trim() !== "") {
      onSubmit(summary);
      setSummary("");
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Session Summary</h3>
        <textarea
          className="summary-input"
          placeholder="Enter a summary for this session..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="popup-buttons">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={summary.trim() === ""}
          >
            Submit
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .summary-input {
          width: 100%;
          height: 100px;
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: vertical;
        }
        .popup-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .submit-btn,
        .cancel-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .submit-btn {
          background: #007bff;
          color: white;
        }
        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .cancel-btn {
          background: #dc3545;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SummaryPopup;
