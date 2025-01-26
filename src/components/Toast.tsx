import React from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null; // Don't render if there's no message

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1%", // Position slightly above the bottom
        left: "50%",
        transform: "translateX(-50%)",
        background: "#323232", // Dark background
        color: "white", // White text
        padding: "12px 16px", // Padding for better visibility
        borderRadius: "8px", // Rounded corners
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Subtle shadow
        fontSize: "1rem", // Font size for readability
        textAlign: "center", // Centered text
        zIndex: 1000, // High z-index to appear above other elements
        maxWidth: "90%", // Limit width for mobile screens
        wordWrap: "break-word", // Wrap long text
      }}
    >
      {message}
      <button
        style={{
          background: "transparent",
          color: "white",
          border: "none",
          marginLeft: "10px",
          cursor: "pointer",
          fontSize: "1rem",
          padding: "0",
        }}
        onClick={onClose}
      >
        ✖
      </button>
    </div>
  );
};

export default Toast;
