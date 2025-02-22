
import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { Search, Send, Paperclip, ArrowLeft } from "lucide-react";

const Chat = () => {
  const socket = useMemo(() => io(`${import.meta.env.VITE_API_BASE_URL}`, { autoConnect: false }), []);
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState(null);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [receiverName, setReceiverName] = useState("");
  const [selectedChat, setSelectedChat] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicBgColor, setDynamicBgColor] = useState("bg-gray-50");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Helper function to remove duplicates
  const removeDuplicateMessages = (messages) => {
    const uniqueMessages = [];
    const messageSet = new Set();

    for (const msg of messages) {
      const uniqueKey = msg._id || `${msg.sender}-${msg.receiver}-${msg.timestamp}`;
      if (!messageSet.has(uniqueKey)) {
        uniqueMessages.push(msg);
        messageSet.add(uniqueKey);
      }
    }

    return uniqueMessages;
  };

  const getLastMessage = (userId) => {
    const userMessages = selectedChat.filter(
      (msg) => msg.sender === userId || msg.receiver === userId
    );
    return userMessages[userMessages.length - 1]?.message || "";
  };

  useEffect(() => {
    socket.connect();

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();

    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.sender === receiverId || newMessage.receiver === receiverId) {
        setSelectedChat((prev) => {
          const updatedChat = [...prev, newMessage];
          return removeDuplicateMessages(updatedChat);
        });
      }
    });

    socket.on("disconnect", () => {
      socket.connect();
    });

    return () => {
      socket.disconnect();
    };
  }, [receiverId, socket]);

  const fetchChats = async (receiverId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats/conversation/${userInfo._id}/${receiverId}`
      );
      setSelectedChat(removeDuplicateMessages(data));
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!receiverId) {
      alert("Please select a user to chat with");
      return;
    }

    const formData = new FormData();
    formData.append("sender", userInfo._id);
    formData.append("receiver", receiverId);
    formData.append("message", message);
    if (media) formData.append("media", media);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chats/send`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      socket.emit("sendMessage", data);

      setSelectedChat((prev) => {
        const updatedChat = [...prev, data];
        return removeDuplicateMessages(updatedChat);
      });

      setMessage("");
      setMedia(null);
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleUserSelect = async (userId, userName) => {
    setReceiverId(userId);
    setReceiverName(userName);
    await fetchChats(userId);
    setDynamicBgColor("bg-gray-900");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetChatView = () => {
    setReceiverId(null);
    setDynamicBgColor("bg-gray-50");
  };

  return (
    <div className={`h-screen ${dynamicBgColor}`}>
      <div className="container mx-auto h-full p-4">
        <div className="flex flex-col md:flex-row h-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Users List */}
          <div
            className={`${
              receiverId ? "hidden" : "flex"
            } md:flex flex-col w-full md:w-1/3 lg:w-1/4 bg-gray-50 border-r`}
          >
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleUserSelect(user._id, user.name)}
                  className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-100 transition-colors ${
                    receiverId === user._id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-semibold truncate">{user.name}</h3>
                      <span className="text-xs text-gray-500">12:34 PM</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {getLastMessage(user._id) || "No messages yet"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`${
              receiverId ? "flex" : "hidden"
            } md:flex flex-col flex-1 bg-white`}
          >
            {receiverId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center space-x-4">
                  <button onClick={resetChatView} className="md:hidden">
                    <ArrowLeft className="w-6 h-6 text-gray-500" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {receiverName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{receiverName}</h3>
                    <p className="text-sm text-gray-500">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-hidden mb-16">
                  {selectedChat.map((chat, index) => (
                    <div
                      key={`${chat._id || index}`}
                      className={`flex ${
                        chat.sender === userInfo._id ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          chat.sender === userInfo._id
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{chat.message}</p>
                        {chat.media && (
                          <img
                            src={chat.media}
                            alt="Media"
                            className="mt-2 rounded-lg max-w-full"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form
                  onSubmit={sendMessage}
                  className="p-4 border-t flex items-center space-x-4 fixed bottom-0 left-0 w-full bg-white"
                >
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setMedia(e.target.files[0])}
                    />
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </label>
                  <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Select a user to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
