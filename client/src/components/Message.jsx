import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import { useParams } from "react-router-dom";

const Message = () => {
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); 

  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const { targetId } = useParams();

  useEffect(() => {
    if (!user || !user._id) return;
    const socket = createSocketConnection();
    socketRef.current = socket; 

    socket.on("connect", () => {
      console.log("New client connected:", socket.id);
      socket.emit("joinChat", { name: user?.username, userId, targetId });
    });

    socket.on("messageReceived", ({ name, text }) => {
      console.log(name, text);
      setMessages((prev) => [...prev, { name, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetId, user?.username]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        name: user?.username,
        userId,
        targetId,
        text: newMsg,
      });
      // setMessages((prev) => [...prev, { name: user?.username, text: newMsg }]);
      setNewMsg("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-black text-white">
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <img
          src={user?.profilePic}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{user?.username}</h2>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div className="">
            <div className={`text-sm font-thin opacity-30 max-w-full px-2 rounded-2xl break-words ${msg.name === user?.username
                  ? "flex justify-start"
                  : "flex justify-end"}`}>
              {msg.name.split(" ")[0]}
            </div>

            <div
              key={i}
              className={`max-w-[75%] p-3 rounded-2xl break-words ${
                msg.name === user?.username
                  ? "bg-pink-600 self-end mr-auto"
                  : "bg-gray-700 self-start ml-auto"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-4 border-t border-gray-800">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 bg-gray-800 p-3 rounded-full text-white outline-none mr-3"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // ✅ Send on Enter key too
        />
        <button
          onClick={sendMessage}
          className="text-pink-500 text-2xl hover:text-pink-600"
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default Message;
