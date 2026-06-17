import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { PhoneFrame } from "./components/PhoneFrame";
import { AuthScreen } from "./components/Shared/AuthScreen";
import { BuyerFlow } from "./components/BuyerFlow";
import { SellerFlow } from "./components/SellerFlow";
import { ChatList } from "./components/Shared/ChatList";
import { ChatScreen } from "./components/Shared/ChatScreen";
import { NotificationsTab } from "./components/Shared/NotificationsTab";
import { ProfileTab } from "./components/Shared/ProfileTab";
import { Home, MessageSquare, Bell, User, Sparkles, Users, RefreshCw } from "lucide-react";

// Sub-component containing app layout
const AppContent: React.FC = () => {
  const { currentUser, notifications, allMessages } = useApp();
  
  // Navigation tabs: "dash" | "chats" | "alerts" | "profile"
  const [activeTab, setActiveTab] = useState<"dash" | "chats" | "alerts" | "profile">("dash");

  // Perspectives switch mode: Toggles whether we see Buyer dashboard or Seller dashboard
  const [perceivedRole, setPerceivedRole] = useState<"buyer" | "seller">("buyer");

  // Active chat session state
  const [activeChat, setActiveChat] = useState<{ needId: string; partnerId: string } | null>(null);

  // Sync perceivedRole when user logs in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "seller") {
        setPerceivedRole("seller");
      } else {
        setPerceivedRole("buyer"); // default to buyer for "buyer" or "both"
      }
      setActiveTab("dash");
      setActiveChat(null);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <AuthScreen />;
  }

  // Count unread notifications
  const unreadNotifsCount = notifications.filter((n) => !notifIsRead(n)).length;

  function notifIsRead(n: any) {
    return n.read;
  }

  // Count unread chats (simply total message count for mock visual)
  const totalConvosWithMessages = allMessages.filter(
    (m) => m.senderId === currentUser.id || m.receiverId === currentUser.id
  ).length;

  const handleOpenChatFromSub = (needId: string, partnerId: string) => {
    setActiveChat({ needId, partnerId });
  };

  const handleNavigateToNeed = (needId: string) => {
    // Switch to Dashboard tab, and make sure we view appropriate perspective
    setPerceivedRole("buyer"); 
    setActiveTab("dash");
    setActiveChat(null);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full w-full bg-brand-dark">
      
      {/* Top Testing Switches Panel (Multi-Role perspective selector) */}
      {(currentUser.role === "both" || currentUser.id === "user_b1" || currentUser.id === "user_s1" || currentUser.id === "user_s2") && (
        <div className="bg-slate-950/90 border-b border-slate-900 px-3.5 py-1.5 flex items-center justify-between z-10 select-none">
          <div className="flex items-center gap-1">
            <Users size={11} className="text-brand-orange" />
            <span className="text-[10px] text-slate-400 font-display font-medium">Viewing perspective:</span>
          </div>
          
          <div className="flex bg-brand-navy p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setPerceivedRole("buyer")}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition cursor-pointer ${
                perceivedRole === "buyer"
                  ? "bg-brand-blue text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
              id="switch-perceived-buyer"
            >
              Buyer View
            </button>
            <button
              onClick={() => setPerceivedRole("seller")}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition cursor-pointer ${
                perceivedRole === "seller"
                  ? "bg-brand-orange text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
              id="switch-perceived-seller"
            >
              Seller View
            </button>
          </div>
        </div>
      )}

      {/* Screen Container */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        
        {/* Navigation Core Tab Views */}
        {activeTab === "dash" && (
          perceivedRole === "buyer" ? (
            <BuyerFlow onOpenChat={handleOpenChatFromSub} />
          ) : (
            <SellerFlow onOpenChat={handleOpenChatFromSub} />
          )
        )}

        {activeTab === "chats" && (
          <ChatList onOpenChat={handleOpenChatFromSub} />
        )}

        {activeTab === "alerts" && (
          <NotificationsTab onNavigateToNeed={handleNavigateToNeed} />
        )}

        {activeTab === "profile" && (
          <ProfileTab />
        )}

      </div>

      {/* Floating Messenger Frame (Overlay for smooth flow layout) */}
      {activeChat && (
        <ChatScreen
          needId={activeChat.needId}
          partnerId={activeChat.partnerId}
          onBack={() => setActiveChat(null)}
        />
      )}

      {/* ANDROID BOTTOM NAVIGATION BAR (API 35 STYLE) */}
      <div className="h-[52px] bg-brand-navy/95 border-t border-slate-900 px-5 flex items-center justify-between z-40 select-none pb-1 bg-opacity-70 backdrop-blur-md">
        {[
          { id: "dash", label: perceivedRole === "buyer" ? "My Needs" : "Browse", icon: Home },
          { id: "chats", label: "Chats", icon: MessageSquare, badge: totalConvosWithMessages > 0 ? true : false },
          { id: "alerts", label: "Alerts", icon: Bell, badgeCount: unreadNotifsCount },
          { id: "profile", label: "Profile", icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setActiveChat(null); // clear conversation focus if nav changes
              }}
              className={`relative flex flex-col items-center justify-center pt-2 pb-1.5 px-3 transition duration-200 cursor-pointer ${
                isActive
                  ? perceivedRole === "buyer"
                    ? "text-brand-blue"
                    : "text-brand-orange"
                  : "text-slate-550 hover:text-slate-200"
              }`}
              id={`nav-tab-${item.id}`}
            >
              <div className="relative">
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* Dot notification or message counter */}
                {item.id === "alerts" && (item.badgeCount ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-slate-950 text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse border border-brand-navy font-mono">
                    {item.badgeCount}
                  </span>
                )}

                {item.id === "chats" && item.badge && (
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-brand-blue rounded-full border border-brand-navy animate-ping" />
                )}
              </div>
              <span className="text-[8.5px] font-sans font-semibold tracking-tight mt-1 truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <PhoneFrame>
        <AppContent />
      </PhoneFrame>
    </AppProvider>
  );
}
