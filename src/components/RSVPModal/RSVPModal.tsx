import React, { useState } from "react";
import "./RSVPModal.css";
import "../../App.css";


type RSVPModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onRSVP: (rsvp: boolean) => Promise<void>; // Assume onRSVP is async and returns a promise
  };


const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, onRSVP }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRSVP = async (rsvp: boolean) => {
    setLoading(true);
    try {
      await onRSVP(rsvp);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">RSVP to the Party!</h2>
        <div className="modal-buttons">
          <button className="modal-button yes" onClick={() => handleRSVP(true)} disabled={loading}>
        Yes, I'll be there!
          </button>
          <button className="modal-button no" onClick={() => handleRSVP(false)} disabled={loading}>
          Won't make it
          </button>
        </div>
        {loading && (
          <div className="spinner">
            <span></span> {/* This is where the spinner animation occurs */}
          </div>
        )}
        <button className="modal-close-button" onClick={onClose} disabled={loading}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RSVPModal;
