import React from "react";
import { useApp } from "../../context/AppContext";
import { MessageSquare, ArrowRight, CornerDownRight, MessageCircleOff } from "lucide-react";

interface ChatListProps {
  onOpenChat: (needId: string, partnerId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onOpenChat }) => {
  const { currentUser, allMessages, allNeeds, allUsers } = useApp();

  if (!currentUser) return null;

  // Group messages by (needId + partnerId) to find unique conversations
  const conversationsMap = new Map<string, { needId: string; partnerId: string; lastMsg: any }>();

  allMessages.forEach((msg) => {
    // Only concern conversations involving current user
    if (msg.senderId !== currentUser.id && msg.receiverId !== currentUser.id) return;

    const partnerId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
    const key = `${msg.needId}_${partnerId}`;

    const existing = conversationsMap.get(key);
    // Keep the latest message based on timestamp
    if (!existing || new Date(msg.timestamp) > new Date(existing.lastMsg.timestamp)) {
      conversationsMap.set(key, {
        needId: msg.needId,
        partnerId,
        lastMsg: msg,
      });
    }
  });

  const activeConvos = Array.from(conversationsMap.values()).sort(
    (a, b) => new Date(b.lastMsg.timestamp).getTime() - new Date(a.lastMsg.timestamp).getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-brand-dark/95 text-slate-100">
      
      {/* Chats Header Title */}
      <div className="h-12 bg-brand-navy border-b border-slate-800/80 px-4 flex items-center justify-between">
        <span className="text-xs font-display font-extrabold text-white tracking-wide flex items-center gap-1.5">
          <MessageSquare size={13} className="text-brand-blue" />
          Inbox Messaging
        </span>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
          {activeConvos.length} threads
        </span>
      </div>

      {/* Conv list */}
      <div className="p-4 space-y-3">
        {activeConvos.length === 0 ? (
          <div className="py-14 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl">
            <MessageCircleOff size={28} className="mx-auto text-slate-600" />
            <div>
              <p className="text-xs text-slate-400 font-bold">No active conversations</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto px-6">
                Accepted bids automatically initialize safe communication channels here. Go bid or accept offers!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeConvos.map((convo) => {
              const partner = allUsers.find((u) => u.id === convo.partnerId);
              const need = allNeeds.find((n) => n.id === convo.needId);
              
              if (!partner) return null;

              return (
                <div
                  key={`${convo.needId}_${convo.partnerId}`}
                  onClick={() => onOpenChat(convo.needId, convo.partnerId)}
                  className="p-3 bg-brand-navy border border-slate-850 rounded-xl hover:border-slate-700 transition cursor-pointer flex gap-3"
                  id={`chat-thread-${convo.needId}-${convo.partnerId}`}
                >
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-800"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-[11.5px] font-bold text-slate-200 truncate pr-2">
                        {partner.name}
                      </h4>
                      <span className="text-[8px] text-slate-500 font-mono leading-none">
                        {new Date(convo.lastMsg.timestamp).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Associated Need link badge */}
                    {need && (
                      <div className="flex items-center gap-1 text-[9px] text-brand-orange font-medium">
                        <CornerDownRight size={8} />
                        <span className="truncate max-w-[150px]">Need: "{need.title}"</span>
                      </div>
                    )}

                    {/* snippet */}
                    <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                      {convo.lastMsg.senderId === currentUser.id ? "You: " : ""}
                      {convo.lastMsg.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-center pl-1.5 text-slate-600 hover:text-brand-blue">
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
