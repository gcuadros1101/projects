import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserIdByPhone } from "../service/api";
import { parse } from "path";
import '../App.css';

type User = {
  userId: string;
  eligibility: boolean;
};

type LoginProps = {
  setUser: (user: User) => void;
};

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to handle navigation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const DEV_PHONE = "223500000"; // Hardcoded development phone number
    
    if (phone === DEV_PHONE) {
        // Simulate a successful response for the hardcoded number
        setUser({ userId: "1", eligibility: true}); // Use any mock userId
        console.log("Development phone number detected, bypassing API.");
        navigate("/card");
        return;
    }

    setLoading(true);

    try {

      const fetchedUserId = await fetchUserIdByPhone(phone);
      if (fetchedUserId) {
        //const eligibility = await fetchUserEligibility(parsed_body.userId);
        setUser({ userId: fetchedUserId, eligibility: true});  // TODO: update "eligibility=true" placeholder with getUserEligibility endpoint
        console.log("User recognized. Navigating to Card.");
        navigate("/card");
          return;
      }
      else {
        setErrorMessage("Sorry, we don't recognize this number. Is there another number?");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => setErrorMessage(""), 5000); // Clear the error after 3 seconds
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome!</h1>
      <p>To access the invite information...</p>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Please enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "80%",
            maxWidth: "300px",
            marginBottom: "10px",
          }}
        />
        <br />
        <button
          type="submit"
          disabled={loading} // Disable button when loading
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            background: loading ? "#aaa" : "#4CAF50", // Change button color when loading
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer", // Change cursor when loading
          }}
        >
          {loading ? "Submitting..." : "Submit"} {/* Conditional text */}
        </button>
      </form>
      {loading && ( // Display loading icon
        <div className="spinner" style={{ marginTop: "20px" }}>
          <span></span>
        </div>
      )}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default Login;
