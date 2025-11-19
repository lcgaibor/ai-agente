'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { UserProfile } from '@/components/user-profile';
import { Loader } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface UserContext {
  name?: string;
  preferences: string[];
  topics: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({
    preferences: [],
    topics: [],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (!hasGreeted) {
      const greeting: Message = {
        id: '1',
        type: 'agent',
        content: '¡Hola! 👋 Soy AsistenteLess, tu agente de IA personal. Estoy aquí para ayudarte a responder preguntas, explorar temas nuevos y aprender más sobre ti. ¿Cuál es tu nombre?',
        timestamp: new Date(),
      };
      setMessages([greeting]);
      setHasGreeted(true);
    }
  }, [hasGreeted]);

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
          userContext,
        }),
      });

      const data = await response.json();

      // Update user context if new information was extracted
      if (data.updatedContext) {
        setUserContext(data.updatedContext);
      }

      // Add agent response
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Lo siento, algo salió mal. Intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([{
      id: '1',
      type: 'agent',
      content: '¡Hola! 👋 Soy AsistenteLess, tu agente de IA personal. Estoy aquí para ayudarte a responder preguntas, explorar temas nuevos y aprender más sobre ti. ¿Cuál es tu nombre?',
      timestamp: new Date(),
    }]);
    setUserContext({
      preferences: [],
      topics: [],
    });
    setHasGreeted(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            AsistenteLess
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tu agente de IA personal</p>
        </div>

        <UserProfile userContext={userContext} />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <button
            onClick={handleNewConversation}
            className="w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-gray-800 dark:text-white hover:shadow-md transition-shadow font-medium"
          >
            + Nueva Conversación
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400">
          <p>AsistenteLess v1.0</p>
          <p className="mt-2">Amable • Inteligente • Contextual</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Loader className="w-5 h-5 animate-spin" />
              <span>AsistenteLess está pensando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
