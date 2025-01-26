import React from "react";
import "./RSVPModal.css";

type RSVPModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onRSVP: (rsvp: boolean) => void;
};


const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, onRSVP }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">RSVP to the Party!</h2>
        {/* <p className="modal-text">Can we count on you to join the fun?</p> */}
        <div className="modal-buttons">
          <button className="modal-button yes" onClick={() => onRSVP(true)}>
            Yes, I'll be there!
          </button>
          <button className="modal-button no" onClick={() => onRSVP(false)}>
            Sorry, I won't make it
          </button>
        </div>
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RSVPModal;
