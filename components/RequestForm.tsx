import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, AIResponse } from '../types';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { startChatSession, sendMessageToBot } from '../services/gemini';

interface ChatInterfaceProps {
  onRequestComplete: (data: AIResponse) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onRequestComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Initialize chat on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      try {
        startChatSession();
        // Send a hidden initial trigger to get the bot to start the conversation
        handleBotInteraction("Hola, quiero solicitar francos.", true);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Error desconocido al iniciar el chat.");
      }
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleBotInteraction = async (userMessageText: string, hidden: boolean = false) => {
    if (!hidden) {
      const newUserMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: userMessageText
      };
      setMessages(prev => [...prev, newUserMsg]);
    }
    
    setIsTyping(true);

    try {
      const response = await sendMessageToBot(userMessageText);
      setIsTyping(false);

      if (response.completedJson) {
        onRequestComplete(response.completedJson);
      } else if (response.text) {
        const newBotMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text
        };
        setMessages(prev => [...prev, newBotMsg]);
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: "Lo siento, tuve un problema de conexión. ¿Podrías repetirlo?"
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || error) return;
    
    const text = inputValue;
    setInputValue('');
    handleBotInteraction(text);
  };

  if (error) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-red-200 flex flex-col h-[400px] items-center justify-center p-8 text-center animate-fade-in-up">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Error de Configuración</h3>
        <p className="text-slate-600 max-w-md">
          No se pudo conectar con el asistente. Es probable que falte la configuración de seguridad (API Key).
        </p>
        <p className="text-xs text-slate-400 mt-4 bg-slate-100 p-2 rounded">
          Detalle: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col h-[600px] animate-fade-in-up">
      {/* Header */}
      <div className="bg-red-700 p-4 text-white flex items-center gap-3 shadow-md z-10">
        <div className="bg-white/10 p-2 rounded-full border border-white/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-wide">Asistente RR.HH.</h2>
          <p className="text-red-100 text-xs">RM&S S.R.L.</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-red-100 border-red-200' : 'bg-slate-200 border-slate-300'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-red-700" /> : <Bot className="w-5 h-5 text-slate-700" />}
              </div>
              
              <div
                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-red-700 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[80%] gap-2">
               <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-slate-700" />
               </div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-1">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none bg-slate-50"
            disabled={isTyping}
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-red-700 text-white p-3 rounded-xl hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center justify-center min-w-[50px]"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};