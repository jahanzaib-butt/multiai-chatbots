import React, { useState, useRef, useEffect } from 'react';
import { Bot, Trash2, Wifi, WifiOff, Settings } from 'lucide-react';
import { ChatAgent } from './lib/ChatAgent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { StatusBar } from './components/StatusBar';
import { BotWizard } from './components/BotWizard/BotWizard';

function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAgentRef = useRef<ChatAgent | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat agent
  React.useEffect(() => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setError('Missing GROQ API key. Please set the VITE_GROQ_API_KEY environment variable.');
      return;
    }

    try {
      const savedConfig = localStorage.getItem('botConfig');
      const config = savedConfig ? JSON.parse(savedConfig) : {
        name: "Friendly Assistant",
        personality: ["Helpful", "Friendly"],
        temperature: 0.7,
        maxTokens: 1024
      };

      chatAgentRef.current = new ChatAgent({
        ...config,
        apiKey
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize chat agent');
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatAgentRef.current || !isOnline) return;

    setIsLoading(true);
    setError(null);
    
    try {
      await chatAgentRef.current.sendMessage(input);
      setMessages([...chatAgentRef.current.getMessageHistory()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleClear = () => {
    if (chatAgentRef.current) {
      chatAgentRef.current.clearHistory();
      setMessages([]);
      setError(null);
    }
  };

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <BotWizard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">AI Chat Assistant</h1>
              <StatusBar isOnline={isOnline} isTyping={isLoading} />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Configure</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Clear</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <div className="flex-1 bg-white rounded-xl shadow-sm mb-4 p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
              <Bot className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium">Welcome to AI Chat!</p>
                <p className="text-sm">Start a conversation with your AI assistant</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.content} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          isOnline={isOnline}
          onInputChange={setInput}
          onSend={handleSend}
        />
      </main>
    </div>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}