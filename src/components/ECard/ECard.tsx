import React from "react";
import "./ecard.css";
import inviteImage from "../../assets/images/cutie3.png";


type ECardProps = {
    eventTitle: string;
    eventDescription: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventDescription2?: string;
    registryUrl: string;
    isEligibleForRegistry: boolean;
    onRSVP?: () => void;
    onReveal?: () => void;
    image?: string;
};

const ECard: React.FC<ECardProps> = ({ eventTitle, eventDescription, eventDate, eventTime, eventLocation, eventDescription2, registryUrl, isEligibleForRegistry, onRSVP, onReveal, image }) => {
  return (
    <div className="ecard-container">
      <div className="ecard">
        <img src={inviteImage} alt="Event graphic" className="ecard-image" />
        <h1>{eventTitle}</h1>
        <h3>{eventDescription}</h3>
        <p>{eventDate}{eventTime}</p>
        <p>{eventLocation}</p>
        <p>{eventDescription2}</p>
        <button onClick={onReveal}>Click here to find out the gender!</button>
        <p></p>
        <button onClick={onRSVP}>Please RSVP by April 9th</button>
        <p></p>
        {isEligibleForRegistry && (
                <a href={registryUrl} target="_blank" rel="noopener noreferrer">View Registry</a>
            )}
      </div>
    </div>
  );
};

export default ECard;
