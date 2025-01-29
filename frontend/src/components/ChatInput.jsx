import React from 'react';
import { Send, Image, Paperclip, Smile } from 'lucide-react';

const ChatInput = ({ input, inputRef, onInputChange, onSend, onEmojiClick }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          onClick={onEmojiClick}
        >
          <Smile size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSend();
              }
            }}
            type="text"
            placeholder="Type your message here..."
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <Image size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
          <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        <button
          onClick={onSend}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;