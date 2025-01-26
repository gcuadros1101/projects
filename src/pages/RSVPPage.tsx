import React, { useState } from "react";

const RSVPPage: React.FC  = () => {
  const [response, setResponse] = useState<string | null>(null);

  const handleResponse = (answer: string) => {
    setResponse(answer);
    alert(`Thank you for your RSVP: ${answer}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>RSVP</h1>
      <p>Will you be able to attend?</p>
      <div>
        <button onClick={() => handleResponse("Yes")} style={{ margin: "10px" }}>
          Yes
        </button>
        <button onClick={() => handleResponse("No")} style={{ margin: "10px" }}>
          No
        </button>
      </div>
      {response && <p>You responded: {response}</p>}
    </div>
  );
};

export default RSVPPage;
