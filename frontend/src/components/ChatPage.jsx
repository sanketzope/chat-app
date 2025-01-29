import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { getMessagess } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import "emoji-picker-element";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import useWebSocket from "./useWebSocket";
import useEmojiPicker from "./useEmojiPicker";
import SearchBar from "./SearchBar";
import ChatMessage from "./ChatMessage";
import { formatTime, getUsernameColor } from "./messageUtils";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  
  const { stompClient, messages, setMessages } = useWebSocket(roomId, currentUser, connected);
  const { showEmoji, setShowEmoji, emojiPickerRef } = useEmojiPicker(inputRef, setInput);

  // Redirect if not connected
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser, navigate]);

  // Load initial messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {
        toast.error("Failed to load messages");
      }
    }
    if (connected) {
      loadMessages();
    }
  }, [connected, roomId, setMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Handle emoji picker positioning
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current?.contains(event.target)) {
        return;
      }
      
      if (event.target.closest('button')?.querySelector('.lucide-smile')) {
        return;
      }
      
      if (emojiPickerRef.current && showEmoji) {
        emojiPickerRef.current.style.display = 'none';
        setShowEmoji(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showEmoji, emojiPickerRef]);

  const handleSendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
        timestamp: new Date().toISOString(),
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    handleTyping();
  };

  const handleTyping = () => {
    if (stompClient && connected) {
      if (typingTimeout) clearTimeout(typingTimeout);

      stompClient.send(
        `/app/typing/${roomId}`,
        {},
        JSON.stringify({ user: currentUser })
      );

      setTypingTimeout(
        setTimeout(() => {
          setIsTyping(false);
        }, 1000)
      );
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  const handleLogout = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  const handleEmojiClick = (event) => {
    event.stopPropagation();
    if (!emojiPickerRef.current) return;

    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const picker = emojiPickerRef.current;
    
    picker.style.position = 'fixed';
    picker.style.left = `${buttonRect.left}px`;
    picker.style.bottom = `${window.innerHeight - buttonRect.top + 10}px`;
    picker.style.zIndex = '1000';
    
    const newShowEmoji = !showEmoji;
    picker.style.display = newShowEmoji ? 'block' : 'none';
    setShowEmoji(newShowEmoji);
  };

  const filteredMessages = searchTerm
    ? messages.filter(
        (msg) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.sender.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ChatHeader
        roomId={roomId}
        onCopyRoomId={handleCopyRoomId}
        onSearchToggle={() => setShowSearch(!showSearch)}
        onLogout={handleLogout}
      />

      {showSearch && (
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col">
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredMessages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                currentUser={currentUser}
                formatTime={formatTime}
                getUsernameColor={getUsernameColor}
              />
            ))}
          </div>

          <ChatInput
            input={input}
            inputRef={inputRef}
            onInputChange={handleInputChange}
            onSend={handleSendMessage}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;