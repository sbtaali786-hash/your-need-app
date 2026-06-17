import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Send, ArrowLeft, Phone, MapPin, CheckCheck, Loader2 } from "lucide-react";

interface ChatScreenProps {
  needId: string;
  partnerId: string;
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ needId, partnerId, onBack }) => {
  const { currentUser, allMessages, allNeeds, allUsers, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  const currentNeed = allNeeds.find((n) => n.id === needId);
  const partnerUser = allUsers.find((u) => u.id === partnerId);

  // Filter messages for this specific conversation
  const chatMessages = allMessages.filter(
    (m) =>
      m.needId === needId &&
      ((m.senderId === currentUser.id && m.receiverId === partnerId) ||
        (m.senderId === partnerId && m.receiverId === currentUser.id))
  );

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Simulate typing indicator when partner is expected to answer (using a small simulation state)
  useEffect(() => {
    // If the last message was sent by the currentUser, show typing indicator after 1.5 seconds
    if (
      chatMessages.length > 0 &&
      chatMessages[chatMessages.length - 1].senderId === currentUser.id &&
      (partnerId === "user_s1" || partnerId === "user_s2" || partnerId === "user_s3")
    ) {
      const timer = setTimeout(() => {
        setIsTyping(true);
      }, 1500);

      const hideTimer = setTimeout(() => {
        setIsTyping(false);
      }, 3900);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [chatMessages, currentUser.id, partnerId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(needId, partnerId, inputText.trim());
    setInputText("");
  };

  return (
    <div className="absolute inset-0 bg-brand-dark flex flex-col z-50 animate-in fade-in slide-in-from-right duration-250">
      
      {/* Messaging Header */}
      <div className="h-14 bg-brand-navy border-b border-slate-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800/50 cursor-pointer"
            id="chat-back-btn"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={partnerUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
              alt={partnerUser?.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-700"
            />
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white truncate leading-none">
                {partnerUser?.name || "Support Expert"}
              </h3>
              <p className="text-[9px] text-brand-blue capitalize mt-0.5 font-medium leading-none">
                {partnerUser?.role || "Market Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Option info */}
        <div className="text-right text-slate-500 font-mono text-[9px]">
          {currentNeed && (
            <span className="bg-brand-navy font-semibold px-2 py-0.5 rounded border border-slate-800 text-slate-400 capitalize">
              {currentNeed.status}
            </span>
          )}
        </div>
      </div>

      {/* Linked Need Snippet */}
      {currentNeed && (
        <div className="bg-brand-navy/65 px-4 py-2 border-b border-slate-900 flex items-center justify-between text-xs">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500 font-medium">Chatting regarding need:</p>
            <h4 className="text-[11px] font-bold text-slate-200 truncate">{currentNeed.title}</h4>
          </div>
          <div className="text-right ml-2 font-mono">
            <span className="text-brand-orange font-bold text-[11px]">${currentNeed.budget}</span>
            <p className="text-[8px] text-slate-500 flex items-center justify-end gap-0.5 mt-0.5">
              <MapPin size={8} /> {currentNeed.location.split(",")[0]}
            </p>
          </div>
        </div>
      )}

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar bg-brand-dark/95">
        
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-12 h-12 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-slate-600 mb-2">
              <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
            </div>
            <p className="text-xs font-semibold text-slate-400">Initialize Chat</p>
            <p className="text-[10px] text-slate-500 max-w-xs mt-1">
              Ask details, arrange completion timelines, or finalize the hand-off right here safely.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs font-sans leading-relaxed ${
                    isMe
                      ? "bg-brand-blue text-slate-950 font-medium rounded-tr-none"
                      : "bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
                
                <span className="text-[8px] text-slate-500 mt-0.5 px-1 flex items-center gap-1 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && <CheckCheck size={10} className="text-brand-blue" />}
                </span>
              </div>
            );
          })
        )}

        {/* Realtime Typing Simulation Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="bg-slate-850 border border-slate-800/60 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs text-slate-400 flex items-center gap-1.5">
              <Loader2 size={11} className="animate-spin text-brand-orange" />
              <span className="italic">Seller is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Dock */}
      <form onSubmit={handleSend} className="p-3 bg-brand-navy border-t border-slate-800/80 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-brand-dark border border-slate-800 focus:border-brand-blue rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
          id="chat-text-input"
        />
        <button
          type="submit"
          className="bg-brand-orange text-slate-950 hover:opacity-90 active:scale-95 p-2 rounded-xl transition cursor-pointer flex items-center justify-center w-9 h-9"
          id="chat-send-btn"
        >
          <Send size={14} className="translate-x-0.5" />
        </button>
      </form>

    </div>
  );
};
