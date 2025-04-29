import React, { useEffect, useRef, useState } from "react";
import { IoSend, IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Message = () => {
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const user = useSelector((state) => state.user);
  const userId = user?._id;
  const { targetId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinChat", { name: user?.username, userId, targetId });
    });

    socket.on("messageReceived", ({ name, text }) => {
      setMessages((prev) => [
        ...prev,
        {
          senderId: { username: name },
          text,
          timestamp: new Date().toISOString(),
        },
      ]);
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
    setNewMsg("");
  }
  };

  const getMessage = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/message/${targetId}`, {
        withCredentials: true,
      });
      setMessages(res?.data?.message?.chats || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessage();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      <div className="fixed top-0 left-0 w-full z-50 bg-black p-4 border-b border-gray-800 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-xl hover:text-pink-500"
        >
          <IoArrowBack />
        </button>
        <img
          src={user?.profilePic}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">
            {user?.username.split(" ")[0]?.charAt(0).toUpperCase() +
              user?.username.split(" ")[0]?.slice(1).toLowerCase()}
          </h2>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-28 space-y-2">
        {messages.map((msg, i) => (
          <div key={i}>
            <div
              className={`text-xs font-medium opacity-40 mb-1 ${
                msg?.senderId?.username === user?.username ? "text-left" : "text-right"
              }`}
            >
              {msg?.senderId?.username === user?.username
                ? "You"
                : msg?.senderId?.username?.split(" ")[0] || "User"}
            </div>

            <div
              className={`max-w-[75%] p-3 rounded-2xl break-words ${
                msg?.senderId?.username === user?.username
                  ? "bg-pink-600 self-end mr-auto"
                  : "bg-gray-700 self-start ml-auto"
              }`}
            >
              {msg.text}
            </div>

            <p
              className={`text-xs text-gray-400 ${
                msg?.senderId?.username === user?.username
                  ? "text-start mr-auto"
                  : "text-end ml-auto"
              }`}
            >
              sent {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-black p-4 border-t border-gray-800 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-gray-800 p-3 rounded-full text-white outline-none mr-3"
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
