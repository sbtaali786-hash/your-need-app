import React from "react";
import { useApp } from "../../context/AppContext";
import { Bell, BellOff, Check, MessageSquare, Tag, Award, ShieldAlert, Sparkles } from "lucide-react";

interface NotificationsTabProps {
  onNavigateToNeed: (needId: string) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ onNavigateToNeed }) => {
  const { notifications, markNotificationsRead, currentUser } = useApp();

  if (!currentUser) return null;

  const handleMarkAllRead = () => {
    markNotificationsRead();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "offer_received":
        return <Tag size={14} className="text-brand-orange" />;
      case "offer_status":
        return <Award size={14} className="text-brand-teal" />;
      case "message":
        return <MessageSquare size={14} className="text-brand-blue" />;
      default:
        return <Sparkles size={14} className="text-yellow-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-brand-dark/95 text-slate-100">
      
      {/* Title & mark read */}
      <div className="h-12 bg-brand-navy border-b border-slate-800/80 px-4 flex items-center justify-between">
        <span className="text-xs font-display font-extrabold text-white tracking-wide flex items-center gap-1.5">
          <Bell size={13} className="text-brand-orange animate-pulse" />
          Alert Center
        </span>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] text-brand-blue hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            id="btn-notif-mark-read"
          >
            <Check size={11} />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* List Body */}
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="py-14 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl">
            <BellOff size={28} className="mx-auto text-slate-600" />
            <div>
              <p className="text-xs text-slate-400 font-bold">No notifications yet</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto px-6">
                When sellers submit bids on your needs, or buyers accept your bids, notifications will populate here!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.linkId && notif.linkId !== "welcome" && notif.linkId !== "system") {
                    onNavigateToNeed(notif.linkId);
                  }
                }}
                className={`p-3 rounded-xl border flex gap-3 transition cursor-pointer relative overflow-hidden ${
                  notif.read
                    ? "bg-brand-navy/35 border-slate-900/60"
                    : "bg-brand-orange/5 border-brand-orange/20 hover:border-brand-orange/40 shadow-sm"
                }`}
                id={`notif-${notif.id}`}
              >
                {/* Unread circle highlight indicator */}
                {!notif.read && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-orange rounded-bl-xl" />
                )}

                {/* Left Type Icon container */}
                <div className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-850 flex items-center justify-center shrink-0">
                  {getNotifIcon(notif.type)}
                </div>

                {/* Mid content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[11px] font-bold text-slate-100 truncate pr-4">
                      {notif.title}
                    </h4>
                    <span className="text-[8px] text-slate-500 font-mono">
                      {new Date(notif.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">
                    {notif.body}
                  </p>

                  {notif.linkId && notif.linkId !== "welcome" && (
                    <span className="text-[8px] text-brand-blue font-bold font-mono tracking-wider hover:underline block pt-1.5 uppercase">
                      Inspect Details →
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
