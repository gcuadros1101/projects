import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ECard from "../components/ECard/ECard";
import GamePage from "../pages/GamePage";
import RSVPModal from "../components/RSVPModal/RSVPModal";
import Toast from "../components/Toast"; 

type HomeProps = {
    userId: number; // Or string, depending on the type of userId
};

const Home: React.FC<HomeProps> = ({ userId }) => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState(""); // Initialize state
    const navigate = useNavigate(); // React Router hook for navigation

    const handleRSVP = async (rsvp: boolean) => {
        try {
            const userId = 123;              // TODO: update placeholder user ID
            const payload = {userId, rsvp};  // Construct the API request payload

            // Send the POST request
            const response = await fetch("https://your-api-endpoint.com/updateRSVP", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // Check if the response status is not OK
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
        
            const data = await response.json();
            console.log("Response data:", data);

        
            // Display a different message based on the RSVP response
            setResponseMessage(
                rsvp
                ? "Thank you for your RSVP! We're excited to see you there!"
                : "We're sorry you can't make it, but thank you for letting us know!"
            );

        } catch (error) {
            if (error instanceof Error) {
                console.error("Error during RSVP API call:", error.message);
                setResponseMessage("There was an error processing your RSVP. Please try again.");
            } else {
                console.error("Unknown error during RSVP API call:", error);
                setResponseMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setTimeout(() => setResponseMessage(""), 3000); // Clear the error after 3 seconds
            setModalOpen(false); // Close the modal after the API call
        }
    };

    return (
        <div>
            <ECard
                eventTitle={"Little one on the way!"}
                eventDescription={"Please join us for a baby shower in honor of\nGiancarlo & Michelle Cuadros"}
                eventDate="Saturday, April 26th, 2025"
                eventTime={"\n11:30am - 2:00pm"}
                eventLocation={"Potrero Launch Community Room\n2235 3rd St, San Francisco, CA"}
                eventDescription2="Come enjoy lunch and games as we prepare to welcome their bundle of joy!"
                image="https://mkcuadros.github.io/projects/ptj_icon.png/400x200?text=You're+Invited!"
                onRSVP={() => setModalOpen(true)}
                onReveal={() => navigate("/game")}  // Use navigate for routing
            />
            <RSVPModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onRSVP={handleRSVP}
            />
            <Toast
                message={responseMessage}
                onClose={() => setResponseMessage("")}  // Allow manual dismissal
            />
        </div>
    );
    
};

export default Home;
