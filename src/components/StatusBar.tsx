import React from 'react';

interface StatusBarProps {
  isOnline: boolean;
  isTyping: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isOnline, isTyping }) => {
  let status = 'Offline';
  let statusClass = 'text-red-500';

  if (isOnline) {
    if (isTyping) {
      status = 'Typing';
      statusClass = 'text-blue-500';
    } else {
      status = 'Online';
      statusClass = 'text-green-500';
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${statusClass} animate-pulse`} />
      <span className="text-sm text-gray-500">{status}</span>
    </div>
  );
};