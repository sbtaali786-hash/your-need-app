import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Logo } from "../Logo";
import { Mail, Phone, User, Shield, LogIn, ArrowRight } from "lucide-react";
import { UserRole } from "../../types";

export const AuthScreen: React.FC = () => {
  const { signUp, logIn, allUsers } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // UI only
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please fill in email");
      return;
    }

    if (isSignUp) {
      if (!name || !phone) {
        setError("Please fill in all signup fields");
        return;
      }
      try {
        signUp(name, email, phone, role);
      } catch (err: any) {
        setError(err.message || "Signup failed");
      }
    } else {
      const user = logIn(email);
      if (!user) {
        setError("User with this email not registered. Try Quick Logins below!");
      }
    }
  };

  const handleQuickLogin = (emailAddress: string) => {
    setError("");
    const user = logIn(emailAddress);
    if (!user) {
      setError("Login failed for " + emailAddress);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between p-6 bg-brand-dark text-slate-100">
      
      {/* Header with Logo */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <Logo size={90} textClassName="text-xl" />
        <p className="text-slate-400 text-xs text-center mt-1.5 font-sans">
          Post Your Need, Find Your Seller
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="flex-1 flex flex-col justify-center my-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          {isSignUp && (
            <>
              {/* Name Field */}
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-navy/60 border border-slate-800 focus:border-brand-blue rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
                  id="input-name"
                />
              </div>

              {/* Phone Field */}
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-navy/60 border border-slate-800 focus:border-brand-blue rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
                  id="input-phone"
                />
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-500">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-navy/60 border border-slate-800 focus:border-brand-blue rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 outline-none transition"
              id="input-email"
            />
          </div>

          {/* Role Picker (For SignUp only) */}
          {isSignUp && (
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
                <Shield size={11} className="text-brand-orange" />
                Select Your App Purpose:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "buyer", label: "I am a Buyer", desc: "Post needs" },
                  { value: "seller", label: "I am a Seller", desc: "Send offers" },
                  { value: "both", label: "Both Roles", desc: "Dual account" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value as UserRole)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition cursor-pointer ${
                      role === item.value
                        ? "border-brand-orange bg-brand-orange/10 text-white"
                        : "border-slate-800 hover:border-slate-700 bg-brand-navy/30 text-slate-400"
                    }`}
                    id={`role-btn-${item.value}`}
                  >
                    <span className="text-[11px] font-bold leading-tight">{item.label}</span>
                    <span className="text-[8px] opacity-70 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Password (visual) */}
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-slate-500">
              <Shield size={16} />
            </span>
            <input
              type="password"
              placeholder="Password (Mock-Protected)"
              value={password || "••••••••"}
              readOnly
              className="w-full bg-brand-navy/40 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-500 cursor-not-allowed outline-none select-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-blue to-teal-500 hover:opacity-90 active:scale-98 transition text-slate-950 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-[0_4px_12px_rgba(56,189,248,0.25)]"
            id="auth-submit-btn"
          >
            <span>{isSignUp ? "Register Now" : "Sign In"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Change Mode */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-brand-blue hover:underline cursor-pointer"
            id="auth-toggle-mode"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>

      {/* Quick Testing Options */}
      <div className="border-t border-slate-900 pt-4 pb-2 space-y-2">
        <p className="text-[10px] text-center uppercase tracking-widest font-semibold text-slate-500 leading-none">
          Fast-Track testing (Click to login)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {allUsers.slice(0, 3).map((user) => (
            <button
              key={user.id}
              onClick={() => handleQuickLogin(user.email)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-800/60 bg-brand-navy/35 hover:bg-brand-navy/80 hover:border-slate-700 text-left transition cursor-pointer"
              id={`quick-login-${user.id}`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full border border-slate-700 object-cover"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-200 truncate leading-none">
                  {user.name.split(" ")[0]}
                </p>
                <p className="text-[8px] text-slate-400 capitalize truncate">
                  {user.role} Dashboard
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
