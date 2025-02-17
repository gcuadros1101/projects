import React from "react";
import "./ecard.css";
import floralTop from "../../assets/images/flowers.png";

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

const ECard: React.FC<ECardProps> = ({
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
    onReveal
}) => {
    return (
        <div className="ecard-container">
            <div className="ecard">
                {/* Floral Border Image at the Top & Sides */}
                <img src={floralTop} alt="Floral Border" className="ecard-image-top" />

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
        </div>
    );
};

export default ECard;
