import React, { useState } from "react";
import axios from "axios";
import "./FloatingGPTBot.css";
import gptIcon from "../assets/gpticon.png";

const FloatingGPTBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    const result = await processInput(input);
    setOutput(result);
  };

  const processInput = async (input) => {
    const apiKey = "YOUR_OLLAMA_API_KEY"; // Replace with your Ollama API key
    const apiUrl = "https://api.ollama.com/v1/engines/ollama-codex/completions";

    try {
      const response = await axios.post(
        apiUrl,
        {
          prompt: input,
          max_tokens: 150,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return response.data.choices[0].text;
    } catch (error) {
      console.error("Error fetching data from Ollama API:", error);
      return "Error fetching data from Ollama API.";
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-gpt-bot">
      <div className="chat-icon" onClick={toggleChat}>
        <img src={gptIcon} alt="Chat Icon" />
      </div>
      {isOpen && (
        <div className="chat-window">
          <h2>DEMO Bot</h2>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your query"
          />
          <button onClick={handleSubmit}>Submit</button>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default FloatingGPTBot;
