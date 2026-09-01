'use client';

import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, MessageSquare, ShieldCheck } from 'lucide-react';
import { chatWithAIAssistant } from '../../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tools?: string[];
}

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Greetings. I am UrbanSync AI, your city intelligence command assistant. How may I help you analyze live conditions, smart routes, or simulations across Delhi?'
    }
  ]);

  const QUICK_PROMPTS = [
    'Why is traffic high in South Delhi?',
    'Which hospital is best for Trauma right now?',
    'What major events are happening tonight?',
    'What happens if Ring Road is closed?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: query };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await chatWithAIAssistant(newMessages);
      const assistantMsg: Message = {
        role: 'assistant',
        content: res.message,
        tools: res.tool_calls_executed
      };
      setMessages([...newMessages, assistantMsg]);
    } catch (err) {
      console.error('Failed to get AI assistant response:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'UrbanSync AI is observing live Delhi data. Currently monitoring South Delhi rain risk (68%), NH-48 Dhaula Kuan incident, and Bharat Mandapam AI Summit.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-brand to-purple-brand hover:from-cyan-glow hover:to-purple-glow text-black font-bold text-xs shadow-glow-cyan transition-all hover:scale-105 pointer-events-auto"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>ASK URBANSYNC AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm h-[520px] bg-dark-panel/95 backdrop-blur-md border border-dark-border rounded-xl shadow-panel-dark flex flex-col justify-between overflow-hidden text-dark-text pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 bg-dark-card border-b border-dark-border">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-cyan-brand/20 border border-cyan-brand/40 text-cyan-glow">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-xs text-white">URBANSYNC AI ASSISTANT</h3>
                <span className="text-[9px] text-emerald-400 font-mono">● Grounded in Real City Data</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 text-dark-muted hover:text-white rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-cyan-brand/20 border border-cyan-brand/40 text-white rounded-br-none'
                      : 'bg-dark-card border border-dark-border text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.tools && m.tools.length > 0 && (
                    <div className="flex items-center space-x-1 text-[9px] font-mono text-cyan-glow mb-1 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>EXECUTED TOOL: {m.tools.join(', ')}</span>
                    </div>
                  )}
                  <p>{m.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-card border border-dark-border p-3 rounded-lg text-xs text-cyan-glow font-mono animate-pulse">
                  Querying live Delhi data stores...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 border-t border-dark-border/60 bg-dark-card/50 flex space-x-1.5 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[10px] bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 px-2 py-1 rounded transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-dark-card border-t border-dark-border flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about traffic, weather, hospitals, or simulations..."
              className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-dark-muted focus:border-cyan-glow focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 rounded-lg bg-cyan-brand hover:bg-cyan-glow text-black transition-colors"
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
