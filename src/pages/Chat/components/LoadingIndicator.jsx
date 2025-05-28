import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner"></div>
      <span>Loading...</span>
      <style jsx>{`
        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
