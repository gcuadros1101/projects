import React, { useState, Dispatch, SetStateAction  } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserDetailsByPhone } from "../service/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import '../App.css';

type User = {
  userId: string;
  eligibility: boolean;
};

type LoginProps = {
  setUserId: Dispatch<SetStateAction<string | null>>;
  setGenderRevealOnly: Dispatch<SetStateAction<boolean>>;
};

const Login: React.FC<LoginProps> = ({ setUserId, setGenderRevealOnly }) => {
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook to handle navigation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.startsWith("1") && cleanedPhone.length === 11) {
      cleanedPhone = cleanedPhone.substring(1);
  }

    if (cleanedPhone.length < 10) { // Ensure it's a valid number
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    console.log("cleaned phone: " + cleanedPhone)

    const DEV_PHONE = "223500000"; // Hardcoded development phone number
    
    if (cleanedPhone === DEV_PHONE) {
        // Simulate a successful response for the hardcoded number
        setUserId("1"); // Use any mock userId
        console.log("Development phone number detected, bypassing API.");
        navigate("/card");
        return;
    }

    setLoading(true);

    try {

      const userData = await fetchUserDetailsByPhone(cleanedPhone);
    
      if (userData) {
        setUserId(userData.userId);
        setGenderRevealOnly(userData.genderRevealOnly);
        localStorage.setItem("genderRevealOnly", userData.genderRevealOnly.toString());
        console.log("User recognized. Navigating. genderRevealOnly: ", userData.genderRevealOnly);
        navigate(userData.genderRevealOnly ? "/game" : "/card");
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
      <p>To get started...</p>
      <form onSubmit={handleSubmit}>
        <PhoneInput
          country={"us"}
          value={phone}
          onlyCountries={["us"]}
          disableDropdown={true} // Prevents country selection
          disableCountryCode={true} // Hides "+1" from the input
          onChange={(value) => setPhone(value)}
          inputProps={{
            name: "phone",
            required: true,
            autoFocus: true,
            placeholder: "Enter your phone number"
          }}
          inputStyle={{
            width: "80%",
            maxWidth: "300px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
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
