import React, { useState, useEffect } from "react";
import { Battery, Wifi, Signal, RefreshCw, Smartphone } from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // 12-hour format
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-[#030712] py-8 px-4 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
      {/* Absolute glow balls for visual aesthetic */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner introducing the application frame */}
      <div className="max-w-md w-full mb-4 px-4 flex justify-between items-center text-slate-400 text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone size={14} className="text-brand-blue animate-pulse" />
          <span>Android 15 (API 35) Simulator</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50 cursor-pointer"
            id="btn-reset-simulator"
          >
            <RefreshCw size={10} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main Physical Phone Body */}
      <div className="relative w-full max-w-[420px] aspect-[9/19.5] rounded-[55px] bg-[#0c1220] p-3.5 border-[4.5px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col ring-12 ring-slate-900/40 select-none">
        
        {/* Rear internal frame metallic bevel */}
        <div className="absolute inset-0.5 rounded-[50px] border border-cyan-500/10 pointer-events-none" />

        {/* Dynamic Island / Punch Hole */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-6 rounded-2xl bg-black z-50 flex items-center justify-between px-3.5 border border-slate-800/50">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
          </div>
          <div className="w-12 h-1 rounded-full bg-slate-900" />
        </div>

        {/* Side physical buttons */}
        {/* Volume Up */}
        <div className="absolute left-[-6px] top-32 w-1.5 h-12 bg-slate-800 rounded-l border-y border-l border-slate-700" />
        {/* Volume Down */}
        <div className="absolute left-[-6px] top-48 w-1.5 h-12 bg-slate-800 rounded-l border-y border-l border-slate-700" />
        {/* Power Key */}
        <div className="absolute right-[-6px] top-40 w-1.5 h-16 bg-slate-800 rounded-r border-y border-r border-slate-750" />

        {/* Screen Content Wrapper */}
        <div className="w-full h-full rounded-[42px] bg-brand-dark overflow-hidden flex flex-col relative border border-slate-950">
          
          {/* Simulated Status Bar */}
          <div className="h-11 bg-brand-dark text-slate-100 flex items-end justify-between px-6 pb-2.5 z-45 relative font-display font-medium text-xs">
            <span className="tracking-tight text-slate-200">{time}</span>
            <div className="flex items-center gap-1.5">
              <Signal size={13} className="text-slate-300" />
              <span className="font-mono text-[9px] text-brand-blue tracking-tighter scale-90">5G</span>
              <Wifi size={13} className="text-slate-300" />
              <div className="flex items-center gap-0.5 scale-95 origin-right">
                <Battery size={13} className="text-slate-200" />
                <span className="text-[9px] font-mono leading-none font-medium scale-90 text-slate-400">92%</span>
              </div>
            </div>
          </div>

          {/* Core Embedded Application (Scrollable area) */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {children}
          </div>

          {/* Android Pilling Navigation Button */}
          <div className="h-6 bg-brand-dark/95 backdrop-blur-sm flex items-center justify-center pb-2 z-40">
            <div className="w-28 h-1 rounded-full bg-slate-700/80 hover:bg-slate-500 transition duration-300" />
          </div>

        </div>

      </div>

      {/* Footer support text */}
      <div className="mt-4 text-center">
        <p className="text-slate-500 text-[11px]">
          YOUR NEED Marketplace App • Multi-Role Simulated Database Architecture
        </p>
      </div>

    </div>
  );
};
