import React from 'react';
import { Copy, Search, LogOut } from 'lucide-react';

const ChatHeader = ({ roomId, onCopyRoomId, onSearchToggle, onLogout }) => {
  return (
    <header className="border-b dark:border-gray-700 py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold dark:text-gray-100">
            Room: <span className="text-blue-500">{roomId}</span>
          </h1>
          <button
            onClick={onCopyRoomId}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Copy room ID"
          >
            <Copy size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onSearchToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Search size={18} className="text-gray-500 dark:text-gray-400" />
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Leave Room
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;