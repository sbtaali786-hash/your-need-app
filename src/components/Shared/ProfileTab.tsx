import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { User, Mail, Phone, Calendar, MapPin, Pencil, Check, LogOut, Star, Award, MessageSquare } from "lucide-react";

export const ProfileTab: React.FC = () => {
  const { currentUser, allNeeds, allOffers, allRatings, updateProfile, logOut } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [about, setAbout] = useState(currentUser?.about || "");

  if (!currentUser) return null;

  // Compute profile-specific stats
  const userNeeds = allNeeds.filter((n) => n.buyerId === currentUser.id);
  const openNeedsCount = userNeeds.filter((n) => n.status === "Open").length;
  const fulfilledNeedsCount = userNeeds.filter((n) => n.status === "Fulfilled").length;

  const userOffers = allOffers.filter((o) => o.sellerId === currentUser.id);
  const sentOffersCount = userOffers.length;
  const acceptedOffersCount = userOffers.filter((o) => o.status === "Accepted").length;

  // Ratings for this seller
  const receivedRatings = allRatings.filter((r) => r.ratedId === currentUser.id);

  const handleSave = () => {
    updateProfile({
      name,
      phone,
      location,
      about,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-brand-dark/95 text-slate-100">
      
      {/* Visual Header Banner */}
      <div className="relative h-28 bg-gradient-to-r from-brand-blue/30 via-brand-orange/20 to-teal-500/20 flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-dark/30 backdrop-blur-[1px]" />
        <span className="relative text-[10px] font-display font-bold uppercase tracking-widest text-slate-300">
          User Account Profile
        </span>
      </div>

      {/* Profile Details Container */}
      <div className="px-6 -mt-10 relative">
        <div className="flex justify-between items-end">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full border-4 border-brand-dark object-cover shadow-[0_4px_16px_rgba(56,189,248,0.3)] bg-brand-navy"
            />
            {currentUser.ratingCount > 0 && currentUser.role !== "buyer" && (
              <span className="absolute bottom-0 right-0 bg-brand-orange text-slate-950 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-brand-navy">
                <Star size={8} fill="currentColor" />
                {currentUser.rating}
              </span>
            )}
          </div>

          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`cursor-pointer px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 transition ${
              isEditing
                ? "bg-brand-teal text-slate-950 hover:opacity-90"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
            id="profile-toggle-edit"
          >
            {isEditing ? (
              <>
                <Check size={11} />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Pencil size={11} />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Name and Designation */}
        <div className="mt-4">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-navy/60 border border-slate-700/60 rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:border-brand-blue"
              id="edit-profile-name"
            />
          ) : (
            <h2 className="text-lg font-display font-extrabold tracking-tight text-white flex items-center gap-1.5">
              {currentUser.name}
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue font-sans capitalize font-semibold">
                {currentUser.role}
              </span>
            </h2>
          )}
          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
            <Calendar size={11} />
            Member since {currentUser.joinedDate}
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3.5 mt-5">
          {currentUser.role !== "seller" && (
            <>
              <div className="bg-brand-navy/55 border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-none font-bold">Needs</span>
                <p className="text-sm font-display font-bold text-white mt-0.5">{userNeeds.length}</p>
              </div>
              <div className="bg-brand-navy/55 border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-none font-bold">Fulfilled</span>
                <p className="text-sm font-display font-bold text-brand-teal mt-0.5">{fulfilledNeedsCount}</p>
              </div>
            </>
          )}

          {currentUser.role !== "buyer" && (
            <>
              <div className="bg-brand-navy/55 border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-none font-bold">Offers</span>
                <p className="text-sm font-display font-bold text-white mt-0.5">{sentOffersCount}</p>
              </div>
              <div className="bg-brand-navy/55 border border-slate-800/80 rounded-xl p-2.5 text-center">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-none font-bold">Rating</span>
                <p className="text-sm font-display font-bold text-brand-orange mt-0.5 flex items-center justify-center gap-0.5">
                  <Star size={12} fill="currentColor" />
                  {currentUser.ratingCount > 0 ? currentUser.rating : "5.0"}
                </p>
              </div>
            </>
          )}

          {/* Combined third stats slot */}
          <div className="bg-brand-navy/55 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-none font-bold">Reviews</span>
            <p className="text-sm font-display font-bold text-sky-400 mt-0.5">
              {receivedRatings.length}
            </p>
          </div>
        </div>

        {/* Profile Details Cards */}
        <div className="mt-5 space-y-4">
          
          {/* About Bio */}
          <div className="bg-brand-navy/30 border border-slate-800/60 rounded-xl p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Award size={11} className="text-brand-blue" />
              Biography / About Me
            </span>
            {isEditing ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
                placeholder="Describe your expertise or needs..."
                className="w-full mt-2 bg-brand-navy/70 border border-slate-700/60 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-brand-blue resize-none"
                id="edit-profile-about"
              />
            ) : (
              <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                {currentUser.about || "No profile biography supplied yet."}
              </p>
            )}
          </div>

          {/* Contact Details Card */}
          <div className="bg-brand-navy/30 border border-slate-800/60 rounded-xl p-3.5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1 pb-1 border-b border-slate-800/40">
              <Phone size={11} className="text-brand-orange" />
              Contact Details
            </span>

            {/* Email (Disabled/Read-only always) */}
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Mail size={13} className="text-slate-400" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 leading-none">Registered Email</p>
                <p className="truncate mt-0.5 font-mono">{currentUser.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Phone size={13} className="text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 leading-none">Phone Contact</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-0.5 bg-brand-navy/75 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono outline-none focus:border-brand-blue"
                    id="edit-profile-phone"
                  />
                ) : (
                  <p className="truncate mt-0.5 font-mono">{currentUser.phone}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <MapPin size={13} className="text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 leading-none">Location Base</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full mt-0.5 bg-brand-navy/75 border border-slate-700 rounded px-1.5 py-0.5 text-xs outline-none focus:border-brand-blue"
                    id="edit-profile-location"
                  />
                ) : (
                  <p className="truncate mt-0.5">{currentUser.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seller Ratings / Feedback Feed */}
          {currentUser.role !== "buyer" && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <MessageSquare size={11} className="text-teal-400" />
                Sellers Reviews ({receivedRatings.length})
              </span>
              
              {receivedRatings.length === 0 ? (
                <div className="p-3.5 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-[11px]">
                  No reviews submitted for you yet. Complete open bids to receive feedback!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {receivedRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="border border-slate-800/80 bg-brand-navy/20 p-3 rounded-xl space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={rating.raterAvatar}
                            alt={rating.raterName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-[11px] font-bold font-display text-slate-200">
                            {rating.raterName}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-brand-orange text-[10px] font-mono leading-none">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={9}
                              fill={idx < rating.rating ? "currentColor" : "none"}
                              stroke="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                        Regarding: "{rating.needTitle}"
                      </p>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        "{rating.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Change Account Mode Toggler (Dual role helper) */}
          {(currentUser.role === "both" || currentUser.email === "alex@example.com") && (
            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-3.5 text-center">
              <p className="text-[10px] text-brand-orange font-semibold uppercase tracking-wider">
                Multi-Role Intelligence
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Your role allows utilizing both posting and bid viewing screens instantly from standard tabs.
              </p>
            </div>
          )}

          {/* Physical Sign Out Trigger */}
          <button
            onClick={logOut}
            className="w-full mt-2 cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-xl text-xs flex items-center justify-center gap-2 border border-red-500/20 active:scale-98 transition font-semibold"
            id="btn-logout"
          >
            <LogOut size={13} />
            <span>Sign Out of Account</span>
          </button>

        </div>
      </div>

    </div>
  );
};
