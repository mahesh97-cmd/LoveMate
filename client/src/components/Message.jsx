import React, { useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";

const Message = () => {
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const user=useSelector((state)=>state.user)

  // Sample dummy messages
  const messages = [
    { sender: "me", text: "Hey, how's it going?" },
    { sender: "other", text: "Good! You?" },
    { sender: "me", text: "All good. Want to meet up this weekend?" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <img
          src={user.profilePic ||"https://via.placeholder.com/40"}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-3 rounded-2xl ${
              msg.sender === "me"
                ? "bg-pink-600 self-end ml-auto"
                : "bg-gray-700 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex items-center p-4 border-t border-gray-800">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 bg-gray-800 p-3 rounded-full text-white outline-none mr-3"
        />
        <button className="text-pink-500 text-2xl hover:text-pink-600">
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Message;
