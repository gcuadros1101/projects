import React from "react";
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
    resetAppState
}) => {

    const navigate = useNavigate(); // React Router hook for navigation

     // 🔥 Function to clear local storage and navigate to login
     const handleRSVPForSomeoneElse = () => {
        resetAppState(); // 🔥 Clears state and localStorage
        navigate("/login", { replace: true }); // 🔥 Ensure immediate navigation
    };

    return (
        <div className="ecard-container">
            <div className="ecard">
                {/* Floral Border Image at the Top & Sides */}
            
                <div className="ecard-image-wrapper">
                    <img src={floralTop} alt="Floral Border" className="ecard-image-top" />
                </div>

                {/* Title */}
                <h1>{eventTitle}</h1>
                {eventSubtitle && <h2>{eventSubtitle}</h2>}
                
                {/* Details */}
                <p className="small-text">{eventDescription}</p>
                <p className="large-text">{eventParents}</p>
                <p>{eventDate}</p>
                <p className="small-text">{eventLocation}</p>

                <p>{eventDescription2}</p>

                {/* RSVP & Reveal Buttons */}
                <button onClick={onReveal}>Click here to find out the gender!</button>
                <button onClick={onRSVP}>Please RSVP by April 1st</button>

                {/* Registry Link */}
                {isEligibleForRegistry && (
                    <a href={registryUrl} target="_blank" rel="noopener noreferrer">View Registry</a>
                )}
                <p className="small-text">{eventHost}</p>

            </div>
             {/* 🔥 Now this text stays right below the card */}
             <p className="rsvp-other" onClick={handleRSVPForSomeoneElse}>
                Click here to RSVP for someone else
                </p>
        </div>
    );
};

export default ECard;
