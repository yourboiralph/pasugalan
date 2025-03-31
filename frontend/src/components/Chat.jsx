import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { BsSend } from "react-icons/bs";

const Chat = ({ socket }) => {
  const { user } = useContext(AppContext);

  const [allMessages, setAllMessages] = useState([]); // <-- store all messages
  const [message, setMessage] = useState(""); // <-- just the text
  const [onlineCount, setOnlineCount] = useState(0);

  const chatRef = useRef();

  const submitMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("send_message_to_all_from_frontend", {
      user,
      message,
    });

    setMessage(""); // clear input
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("send_message_to_all_from_backend", (data) => {
      console.log("data got from socket: ", data);
      setAllMessages((prev) => [...prev, data]);
    });
    socket.on("user_count", (count) => {
      setOnlineCount(count);
    });

    return () => {
      socket.off("send_message_to_all_from_backend");
      socket.off("user_count");
    };
  }, [socket]);

  useEffect(() => {
    // auto scroll to bottom
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [allMessages]);

  return (
    <div className="h-full max-h-[45rem] bg-[var(--secondary)] text-white flex flex-col">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-center py-2">
          <p>{onlineCount} Online 🟢</p>
        </div>
        <hr className="border border-green-500" />
      </div>

      {/* Chat Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4" ref={chatRef}>
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.user?.id === user.id
                ? "flex-row-reverse text-right"
                : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className="w-14 h-14 flex-shrink-0 rounded-full bg-no-repeat bg-cover border border-white"
              style={{
                backgroundImage: `url(${msg.user?.profile_image})`,
                backgroundSize: "200%",
                backgroundPosition: "-23px -10px",
              }}
            ></div>

            {/* Message */}
            <div className="flex-1 overflow-hidden">
              <p className="font-bold">{msg.user?.username}</p>
              <p className="break-words">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form
        className="shrink-0 border-t border-green-500 p-2 flex items-center"
        onSubmit={submitMessage}
      >
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-800 text-white outline-none"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <BsSend
          type="submit"
          size={20}
          className="ml-3 cursor-pointer"
          onClick={submitMessage}
        />
      </form>
    </div>
  );
};

export default Chat;
