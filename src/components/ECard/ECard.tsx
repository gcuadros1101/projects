import React, { useState } from "react";
import "./ecard.css";
import floralTop from "../../assets/images/flowers.png";
import { useNavigate } from "react-router-dom";

type ECardProps = {
    eventTitle: string;
    eventSubtitle?: string;
    eventDescription: string;
    eventParents: string;
    eventDate: string;
    eventLocation: string;
    eventDescription2?: string;
    eventHost: string;
    registryUrl: string;
    isEligibleForRegistry: boolean;
    onRSVP?: () => void;
    onReveal?: () => void;
    rsvpList?: string[];
};

const ECard: React.FC<ECardProps & { resetAppState: () => void }> = ({
    eventTitle,
    eventSubtitle,
    eventDescription,
    eventParents,
    eventDate,
    eventLocation,
    eventDescription2,
    eventHost,
    registryUrl,
    isEligibleForRegistry,
    onRSVP,
    onReveal,
    resetAppState,
    rsvpList = []
}) => {

    const [flipped, setFlipped] = useState(false);

    const navigate = useNavigate(); // React Router hook for navigation

    const toggleFlip = () => setFlipped(!flipped);

     // 🔥 Function to clear local storage and navigate to login
     const handleRSVPForSomeoneElse = () => {
        resetAppState(); // 🔥 Clears state and localStorage
        navigate("/login", { replace: true }); // 🔥 Ensure immediate navigation
    };

    return (
        <div className="ecard-container">
            <div className={`flip-card ${flipped ? "flipped" : ""}`}>
                <div className="flip-card-inner">

                    {/* 🎟️ Front - Main Event Card */}
                    <div className="flip-card-front">
                        <div className="ecard">
                            <div className="ecard-image-wrapper">
                                <img src={floralTop} alt="Floral Border" className="ecard-image-top" />
                            </div>

                            <h1>{eventTitle}</h1>
                            {eventSubtitle && <h2>{eventSubtitle}</h2>}
                            <p className="small-text">{eventDescription}</p>
                            <p className="large-text">{eventParents}</p>
                            <p>{eventDate}</p>
                            <p className="small-text">{eventLocation}</p>
                            <p>{eventDescription2}</p>

                            <button className="shimmer-button" onClick={onReveal}>Discover gender to unlock registry!</button>
                            <button onClick={onRSVP}>Please RSVP by April 1st</button>

                            {isEligibleForRegistry && (
                                <a href={registryUrl} target="_blank" rel="noopener noreferrer">View Registry</a>
                            )}
                            <p className="small-text">{eventHost}</p>
                        </div>
                    </div>

                    {/* 🔄 Back - RSVP List */}
                    <div className="flip-card-back">
                        <div className="ecard">
                            <h1>Who's Coming?</h1>
                            <ol className="rsvp-list">
                                {rsvpList.length > 0 ? (
                                    rsvpList.map((name, index) => (
                                        <li key={index}>{name}</li>
                                    ))
                                ) : (
                                    <p>No RSVPs yet</p>
                                )}
                            </ol>
                            <button className="flip-btn" onClick={toggleFlip}>Go Back</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* 🔄 Flip Button (Top Right) */}
            <div className="flip-icon" onClick={toggleFlip}>🔄</div>

            {/* 🔥 Stays below the card */}
            <p className="rsvp-other" onClick={handleRSVPForSomeoneElse}>
                Click here to RSVP for someone else
            </p>
        </div>
    );
};

export default ECard;
