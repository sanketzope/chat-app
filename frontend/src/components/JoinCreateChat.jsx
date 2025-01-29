import React, { useState } from "react";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import toast from "react-hot-toast";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import { Users, Plus, LogIn, Copy, RefreshCw } from "lucide-react";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('join'); 

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

 
  const generateRoomId = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setDetail(prev => ({ ...prev, roomId: randomId }));
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(detail.roomId);
    toast.success("Room ID copied to clipboard!");
  };

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Please fill in all fields!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("You joined the room");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await createRoomApi(detail.roomId);
        toast.success("Room Created");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in creating room");
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md transition-all duration-300">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('join')}
              className={`px-4 py-2 rounded-l-lg flex items-center gap-2 transition-colors ${
                activeTab === 'join'
                  ? 'bg-blue-500 text-white'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <LogIn size={18} />
              Join Room
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-r-lg flex items-center gap-2 transition-colors ${
                activeTab === 'create'
                  ? 'bg-orange-500 text-white'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Plus size={18} />
              Create Room
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                onChange={handleFormInputChange}
                value={detail.userName}
                id="userName"
                name="userName"
                placeholder="Enter your name"
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room ID
            </label>
            <div className="relative flex gap-2">
              <input
                name="roomId"
                onChange={handleFormInputChange}
                value={detail.roomId}
                type="text"
                id="roomId"
                placeholder="Enter the room ID"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              {activeTab === 'create' && (
                <button
                  onClick={generateRoomId}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="Generate random room ID"
                >
                  <RefreshCw size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              )}
              {detail.roomId && (
                <button
                  onClick={copyRoomId}
                  className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title="Copy room ID"
                >
                  <Copy size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={activeTab === 'join' ? joinChat : createRoom}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-medium transition duration-300 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : activeTab === 'join'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Please wait...
              </>
            ) : activeTab === 'join' ? (
              <>
                <LogIn size={20} />
                Join Room
              </>
            ) : (
              <>
                <Plus size={20} />
                Create Room
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;