import { useState, useEffect, useRef } from "react";
import "./Chat.css"
import sendbutton from "../assets/send_button.svg"
function Chat() {
  const [chat, setChat] = useState([]);       // All messages
  const [input, setInput] = useState("");     // Input text
  const chatContainerRef = useRef(null);      // Ref for scrolling

  const fetchChat = async () => {
    // const response = await fetch("http://127.0.0.1:8000/");
    // const data = await response.json();
    // setChat(data);
    console.log("chat",chat)
  };

  useEffect(() => {
    fetchChat();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setChat((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log("data-->",data)
      const botMessage = { text: data.response, sender: "bot" };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Error: Could not retrieve response.",
        sender: "error",
      };
      setChat((prev) => [...prev, errorMessage]);
    }
  };

  // Scroll to bottom when chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="Chat">
      <div className="chat-container" ref={chatContainerRef}>
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
          >
            <div className="bubble">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chatBox ">
        <input
          autoFocus
          className="inputChat"
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <div className="sendContainer">
          <div className="send-btn" onClick={sendMessage}>
           <img src={sendbutton} style={{ width: "35px", paddingTop:"10px"}} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
