import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Database, FileText, CornerDownLeft, ShieldCheck } from 'lucide-react';

export default function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am your RAG-powered Drill-Site Copilot, indexed against historical offset well DDRs, formation logs, and operational hazard reports. How can I assist your drilling operation today?',
      timestamp: 'Just now',
      sources: ['eRTMAC Knowledge Base', 'Offshore Well Archives']
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Hardcoded interaction requirement:
    // If user types query containing "LCM" or "Well-03", reply after 1 second:
    // "According to the 2019 Well-03 DDR, a 50 ppb coarse nutshell pill was pumped, which restored circulation in 4 hours."
    setTimeout(() => {
      let replyText = '';
      let replySources = [];

      const normalized = query.toLowerCase();
      if (normalized.includes('lcm') || normalized.includes('well-03') || normalized.includes('well 03') || normalized.includes('well03')) {
        replyText = "According to the 2019 Well-03 DDR, a 50 ppb coarse nutshell pill was pumped, which restored circulation in 4 hours.";
        replySources = ['2019 Well-03 Daily Drilling Report (DDR) #42', 'Mumbai High Offshore Mud Log'];
      } else if (normalized.includes('stuck') || normalized.includes('well-02') || normalized.includes('well 02') || normalized.includes('well02')) {
        replyText = "Well-02 experienced mechanical pipe sticking at 2390m due to reactive smectite shales. Recommend maintaining high circulation rates and conditioning mud before connections.";
        replySources = ['Well-02 Incident Post-Mortem Report', 'Geomechanical Core Analysis (Smectite/Illite)'];
      } else if (normalized.includes('current') || normalized.includes('risk')) {
        replyText = "The active drill is currently approaching the Miocene Shale boundary. Offset logs indicate a 78% probability of lost circulation within the next 100m.";
        replySources = ['Real-Time Telemetry Correlation', 'Miocene Shale Formation Log v3.1'];
      } else {
        replyText = "Scanning historical reports... I found 3 relevant documents. Could you specify if you are looking for cementing logs, DDRs, or mud formulations?";
        replySources = ['Historical Offset Archive', 'eRTMAC Document Index'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: replySources
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Icon (Lucide Bot) */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Drill-Site Copilot"
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 text-white font-semibold text-xs shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-400/40"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
            </div>
            <span className="tracking-wide">Drill-Site Copilot</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 text-white uppercase tracking-wider">
              RAG AI
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[380px] sm:w-[420px] h-[550px] max-h-[85vh] flex flex-col bg-white dark:bg-[#11192e] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#0d1424] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-600/25 border border-blue-500/30 dark:border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                <Bot className="w-5 h-5 text-blue-600 dark:text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs tracking-wide">Drill-Site Copilot</h3>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                    RAG Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Indexed: DDRs, Lithology & Incident Archives</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 transition"
              title="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-50/80 dark:bg-[#0a0f1d]/70">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none border border-blue-500/40'
                      : 'bg-white dark:bg-[#141d33] text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <p className="text-xs whitespace-pre-wrap">{m.text}</p>

                  {/* Sources tag for assistant */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/50 flex flex-wrap items-center gap-1.5 text-[10px] text-blue-600 dark:text-sky-300">
                      <FileText className="w-3 h-3 text-blue-500 dark:text-sky-400 shrink-0" />
                      <span className="text-slate-500 dark:text-slate-400">Cited:</span>
                      {m.sources.map((s, idx) => (
                        <span key={idx} className="bg-slate-100 dark:bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white dark:bg-[#141d33] border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-none p-3 max-w-[85%] space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-[11px] text-blue-600 dark:text-sky-400">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching historical DDR archives...</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-[#0d1424] border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[10px]">
            <button
              onClick={() => handleSendMessage("What was the LCM strategy for Well-03?")}
              className="whitespace-nowrap px-2 py-1 rounded-md bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 shadow-xs transition"
            >
              💡 "LCM in Well-03"
            </button>
            <button
              onClick={() => handleSendMessage("Why was Well-02 stuck?")}
              className="whitespace-nowrap px-2 py-1 rounded-md bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 shadow-xs transition"
            >
              ⚠️ "Well-02 stuck pipe"
            </button>
            <button
              onClick={() => handleSendMessage("What is our current risk horizon?")}
              className="whitespace-nowrap px-2 py-1 rounded-md bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 shadow-xs transition"
            >
              🎯 "Current risk horizon"
            </button>
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#0d1424] border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about LCM, Well-03 DDRs, incidents..."
              className="flex-1 bg-white dark:bg-[#141d33] border border-slate-300 dark:border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isTyping}
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition shadow-md shrink-0"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
