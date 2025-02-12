import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ECard from "../components/ECard/ECard";
import RSVPModal from "../components/RSVPModal/RSVPModal";
import Toast from "../components/Toast"; 
import { fetchUserEligibility, updateRSVP } from "../service/api";

type HomeProps = {
    userId: string; // User ID passed as a prop
    eligibility: boolean; // Eligibility status passed as a prop
    setEligibility: (eligibility: boolean) => void; // Function to update global eligibility state
};

const Home: React.FC<HomeProps> = ({ userId, eligibility, setEligibility }) => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState(""); // Initialize state
    const navigate = useNavigate(); // React Router hook for navigation

    console.log(`userId: ${userId}`);

    useEffect(() => {
        const fetchEligibility = async () => {
            try {
                const result = await fetchUserEligibility(userId);
                setEligibility(result); // Update global eligibility state based on API response
            } catch (error) {
                console.error("Error fetching eligibility:", error);
            }
        };

        fetchEligibility();
    }, [userId, setEligibility]);

    console.log(`fetchedEligibility: ${eligibility}`);

    const handleRSVP = async (rsvp: boolean) => {
        try {
            let rsvpCallStatus = await updateRSVP(userId, rsvp);
            console.log(`rsvpCallStatus: ${rsvpCallStatus}`);

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
                eventTitle={"a little cutie on the way!"}
                eventDescription={"Please join us for a baby shower for\nGiancarlo & Michelle Cuadros"}
                eventDate="Saturday, April 26th, 2025"
                eventTime={"\n11:30am - 2:00pm"}
                eventLocation={"Avalon at Mission Bay, 19th floor\n255 King St, San Francisco, CA"}
                eventDescription2="Come enjoy lunch and games as we prepare to welcome their bundle of joy!"
                image="https://mkcuadros.github.io/projects/ptj_icon.png/400x200?text=You're+Invited!"
                registryUrl="https://my.babylist.com/gc-and-mc"
                isEligibleForRegistry={eligibility}
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
