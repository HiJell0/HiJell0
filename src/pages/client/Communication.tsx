import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MessageSquare, Phone, Send, Sparkles } from 'lucide-react';
import { LINCOLN_LOGO_URL } from '../../constants';

const FAQ_DATABASE = [
  { q: 'how long does bankruptcy take', a: 'A typical Chapter 7 bankruptcy takes about 4-6 months from filing to discharge. Chapter 13 takes 3-5 years.' },
  { q: 'can i keep my car', a: 'In most cases, yes. Bankruptcy exemptions allow you to keep your primary vehicle as long as you stay current on payments.' },
  { q: 'will this stop creditors from calling', a: 'Yes! As soon as we file your case, an "Automatic Stay" goes into effect, which legally prohibits creditors from contacting you.' },
];

export default function Communication() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'staff', text: 'Hi Alex, we received your ID card. Please upload your tax returns when you have a moment.', time: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 2, sender: 'client', text: 'Will do. Do you need state or just federal?', time: new Date(Date.now() - 86400000 * 1.5).toISOString() },
    { id: 3, sender: 'staff', text: 'Both please, for the last two years.', time: new Date(Date.now() - 86400000 * 1).toISOString() },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { id: Date.now(), sender: 'client', text: message, time: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = message.toLowerCase();
    setMessage('');

    // Check FAQ
    const faq = FAQ_DATABASE.find(item => currentInput.includes(item.q));
    if (faq) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'staff',
          text: `[Auto-Answer] ${faq.a}`,
          time: new Date().toISOString(),
          isAuto: true
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-144px)] md:h-[calc(100vh-64px)] flex flex-col -m-4 md:-m-8 overflow-hidden bg-white">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/20"
      >
        {messages.map((msg, idx) => {
          const isClient = msg.sender === 'client';
          // @ts-ignore
          const isAuto = msg.isAuto;
          const nextMsg = messages[idx + 1];
          const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender;

          return (
            <div key={msg.id} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} ${isLastInGroup ? 'mb-2' : 'mb-0.5'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] px-4 py-2.5 shadow-sm text-sm md:text-[15px] leading-snug ${
                isClient 
                  ? 'bg-[#00668a] text-white rounded-2xl rounded-tr-sm' 
                  : isAuto 
                    ? 'bg-white border border-indigo-100 text-stone-900 rounded-2xl rounded-tl-sm'
                    : 'bg-white border border-stone-200 text-stone-900 rounded-2xl rounded-tl-sm'
              }`}>
                {isAuto && (
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Instant Answer
                  </div>
                )}
                <p>{msg.text.replace('[Auto-Answer] ', '')}</p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center gap-2 text-stone-400 text-[11px] font-medium animate-pulse ml-1">
            <Sparkles className="w-3 h-3" />
            Lincoln Law AI is typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-stone-100 shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50 focus:bg-white transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className="bg-[#00668a] text-white p-3 rounded-xl hover:bg-[#005573] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
