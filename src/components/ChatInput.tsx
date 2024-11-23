import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isOnline: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  isOnline,
  onInputChange,
  onSend
}) => (
  <div className="relative">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !isLoading && isOnline && onSend()}
        placeholder="Type your message..."
        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
        disabled={isLoading || !isOnline}
      />
      <button
        onClick={onSend}
        disabled={isLoading || !isOnline || !input.trim()}
        className="bg-blue-600 text-white rounded-xl px-6 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </div>
  </div>
);