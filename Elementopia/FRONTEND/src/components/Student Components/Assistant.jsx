import React, { useEffect, useState } from "react";
import "../../assets/css/Assistant.css"; // Updated relative path
import robotImg from "./robot.avif"; // Import robot image as a module

const Assistant = ({ studentName = "Student" }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = "Hello";

    if (hour < 12) greeting = "Good morning";
    else if (hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";

    const msg = `${greeting}, ${studentName}! I'm here to help you explore Elementopia!`;
    let i = 0;
    const typing = setInterval(() => {
      setMessage((prev) => prev + msg[i]);
      i++;
      if (i >= msg.length) clearInterval(typing);
    }, 50);

    return () => clearInterval(typing);
  }, [studentName]);

  return (
    <div className="assistant-container">
      <div className="robot-avatar" title="Click me for help!">
        <img src={robotImg} alt="Assistant" />
      </div>
      <div className="speech-bubble">{message}</div>
    </div>
  );
};

export default Assistant;
