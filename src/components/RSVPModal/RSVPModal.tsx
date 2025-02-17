import React, { useState } from "react";
import "./RSVPModal.css";
import "../../App.css";

type RSVPModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onRSVP: (rsvp: boolean, dietaryRestrictions?: string) => Promise<void>; // Updated function signature
};

const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, onRSVP }) => {
    const [loading, setLoading] = useState(false);
    const [dietaryRestrictions, setDietaryRestrictions] = useState("");

    if (!isOpen) return null;

    const handleRSVP = async (rsvp: boolean) => {
        setLoading(true);
        try {
            await onRSVP(rsvp, rsvp ? dietaryRestrictions : ""); // Send dietary restrictions only if attending
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">RSVP to the Party!</h2>
                {/* Show dietary restrictions input only if attending */}
                <div className="dietary-input">
                    <label htmlFor="dietary">Any dietary restrictions?</label>
                    <input
                        type="text"
                        id="dietary"
                        value={dietaryRestrictions}
                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                        placeholder="E.g., vegetarian, gluten-free"
                        disabled={loading}
                    />
                </div>
                <p></p>
                <div className="modal-buttons">
                    <button className="modal-button yes" onClick={() => handleRSVP(true)} disabled={loading}>
                        Yes, I'll be there!
                    </button>
                    <button className="modal-button no" onClick={() => handleRSVP(false)} disabled={loading}>
                        Won't make it
                    </button>
                </div>

                {loading && <div className="spinner"><span></span></div>}

                <button className="modal-close-button" onClick={onClose} disabled={loading}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default RSVPModal;
