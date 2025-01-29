export const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  export const getUsernameColor = (username) => {
    const colors = [
      'text-blue-500',
      'text-emerald-500',
      'text-purple-500',
      'text-pink-500',
      'text-yellow-600',
      'text-cyan-500',
      'text-orange-500',
      'text-teal-500',
    ];
  
    const hash = username.split('').reduce(
      (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0
    );
  
    return colors[Math.abs(hash) % colors.length];
  };