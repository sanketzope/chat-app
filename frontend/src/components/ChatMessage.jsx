import React from 'react';

const ChatMessage = ({ message, currentUser, formatTime, getUsernameColor }) => {
  return (
    <div
      className={`flex ${
        message.sender === currentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex items-start gap-3 max-w-xl ${
          message.sender === currentUser ? "flex-row-reverse" : ""
        }`}
      >
        <img
          className="w-8 h-8 rounded-full"
          src={`https://avatar.iran.liara.run/public/${
            message.sender.length * 5
          }`}
          alt=""
        />
        <div
          className={`group ${
            message.sender === currentUser
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
          } p-3 rounded-lg`}
        >
          <div className="flex flex-col gap-1">
            <span 
              className={`text-sm font-semibold ${
                message.sender === currentUser 
                  ? "text-white" 
                  : getUsernameColor(message.sender)
              }`}
            >
              {message.sender}
            </span>
            <div className="flex items-end gap-2">
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-60 whitespace-nowrap self-end">
                {message.timestamp && formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;