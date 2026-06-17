import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Need, Offer, NeedStatus } from "../types";
import { PlusCircle, List, FileText, ClipboardList, CheckCircle, Star, MessageSquare, MapPin, DollarSign, ArrowRight, CornerDownRight, ThumbsUp, Send } from "lucide-react";
import { ChatScreen } from "./Shared/ChatScreen";

interface BuyerFlowProps {
  onOpenChat: (needId: string, partnerId: string) => void;
}

export const BuyerFlow: React.FC<BuyerFlowProps> = ({ onOpenChat }) => {
  const { allNeeds, allOffers, createNeed, acceptOffer, markNeedFulfilled, submitRating, currentUser } = useApp();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"needs" | "post">("needs");
  
  // Status filter for needs
  const [statusFilter, setStatusFilter] = useState<NeedStatus | "All">("All");

  // Selected need details view (for viewing offers)
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);

  // Post need form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("San Francisco, CA");
  const [formSuccess, setFormSuccess] = useState(false);

  // Rating modal state
  const [ratingModalNeed, setRatingModalNeed] = useState<Need | null>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  if (!currentUser) return null;

  // Filter buyer's needs
  const buyerNeeds = allNeeds.filter((n) => n.buyerId === currentUser.id);
  const displayedNeeds = statusFilter === "All" ? buyerNeeds : buyerNeeds.filter((n) => n.status === statusFilter);

  // Handle post submit
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !budget || !location) return;

    createNeed(title, description, category, parseFloat(budget), location);
    setFormSuccess(true);
    
    // Clear form
    setTitle("");
    setDescription("");
    setBudget("");
    
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab("needs"); // switch to needs feed
    }, 1800);
  };

  // Offers received for selected need
  const selectedNeedOffers = selectedNeed 
    ? allOffers.filter((o) => o.needId === selectedNeed.id) 
    : [];

  const handleAcceptOffer = (offerId: string) => {
    acceptOffer(offerId);
    // Refresh selectedNeed in current view by fetching from state again
    if (selectedNeed) {
      setTimeout(() => {
        setSelectedNeed((prev) => {
          if (!prev) return null;
          return { ...prev, status: "In Progress" };
        });
      }, 100);
    }
  };

  const handleMarkFulfilled = (need: Need) => {
    markNeedFulfilled(need.id);
    setSelectedNeed({ ...need, status: "Fulfilled" });
    
    // Launch rating modal for the accepted seller if there is one
    const acceptedOffer = allOffers.find((o) => o.needId === need.id && o.status === "Accepted");
    if (acceptedOffer) {
      setRatingModalNeed(need);
    }
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalNeed) return;

    const acceptedOffer = allOffers.find((o) => o.needId === ratingModalNeed.id && o.status === "Accepted");
    if (acceptedOffer) {
      submitRating(ratingModalNeed.id, acceptedOffer.sellerId, ratingScore, ratingComment);
    }

    setRatingModalNeed(null);
    setRatingScore(5);
    setRatingComment("");
  };

  const CATEGORIES = [
    "Electronics",
    "Furniture",
    "Services",
    "Vehicles",
    "Home Repair",
    "Lessons / Tutor",
    "Delivery & Moving",
    "Pet Care",
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#070a13]">
      
      {/* Tabs list inside app top bar */}
      <div className="h-12 bg-brand-navy border-b border-slate-800/80 px-4 flex items-center justify-between">
        <span className="text-xs font-display font-extrabold text-white tracking-wide">
          {selectedNeed ? "Need Details" : "Buyer Workspace"}
        </span>
        
        {!selectedNeed && (
          <div className="flex bg-brand-dark/80 rounded-lg p-1 border border-slate-800/85">
            <button
              onClick={() => setActiveTab("needs")}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-tight transition cursor-pointer ${
                activeTab === "needs"
                  ? "bg-brand-blue text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              id="buyer-tab-needs"
            >
              My Needs
            </button>
            <button
              onClick={() => setActiveTab("post")}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-tight transition cursor-pointer ${
                activeTab === "post"
                  ? "bg-brand-orange text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              id="buyer-tab-post"
            >
              Post Need
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
        
        {/* DETAIL VIEW OVERLAY / SUB-SCREEN */}
        {selectedNeed ? (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <button
              onClick={() => setSelectedNeed(null)}
              className="text-brand-blue hover:underline text-xs flex items-center gap-1 cursor-pointer font-medium mb-1"
              id="btn-back-to-needs"
            >
              ← Back to My Needs
            </button>

            {/* Need Info Details */}
            <div className="bg-brand-navy p-4 rounded-xl border border-slate-800 shadow-md space-y-3">
              <div className="flex justify-between items-start">
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold font-mono tracking-wider ${
                  selectedNeed.status === "Open" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                  selectedNeed.status === "In Progress" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {selectedNeed.status}
                </span>
                <span className="text-xs font-mono font-bold text-brand-orange">
                  Budget: ${selectedNeed.budget}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-brand-blue font-mono uppercase bg-brand-blue/10 px-2 py-0.5 rounded">
                  {selectedNeed.category}
                </span>
                <h3 className="text-sm font-display font-extrabold text-white mt-1.5 leading-snug">
                  {selectedNeed.title}
                </h3>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {selectedNeed.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-900/50 pt-2.5">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-slate-500" />
                  {selectedNeed.location}
                </span>
                <span>
                  Posted {new Date(selectedNeed.timestamp).toLocaleDateString()}
                </span>
              </div>

              {/* Status workflow triggers */}
              {selectedNeed.status === "In Progress" && (
                <button
                  onClick={() => handleMarkMarkAsCompleteButton(selectedNeed)}
                  className="w-full mt-2.5 cursor-pointer bg-brand-teal text-slate-950 hover:bg-teal-400 py-2 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition active:scale-98"
                  id={`btn-complete-need-${selectedNeed.id}`}
                >
                  <CheckCircle size={14} />
                  <span>Mark Need as Fulfilled (Done)</span>
                </button>
              )}
            </div>

            {/* Offers received box */}
            <div className="space-y-3">
              <h4 className="text-xs font-display font-bold text-slate-300 uppercase tracking-widest pl-1">
                Offers Received ({selectedNeedOffers.length})
              </h4>

              {selectedNeedOffers.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
                  <p className="text-slate-500 text-xs">No offers received yet.</p>
                  <p className="text-[10px] text-slate-600 max-w-xs">
                    Please expect bids from our skilled sellers! Keep notifications active.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedNeedOffers.map((offer) => {
                    const isAccepted = offer.status === "Accepted";
                    const isRejected = offer.status === "Rejected";
                    
                    return (
                      <div
                        key={offer.id}
                        className={`p-3.5 rounded-xl border transition duration-300 flex flex-col space-y-3 ${
                          isAccepted
                            ? "border-brand-teal/40 bg-brand-teal/8"
                            : isRejected
                            ? "border-slate-800/40 bg-slate-900/20 opacity-60"
                            : "border-slate-800 bg-brand-navy hover:border-slate-700"
                        }`}
                      >
                        {/* Offer Header: Seller info and details */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <img
                              src={offer.sellerAvatar}
                              alt={offer.sellerName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-800"
                            />
                            <div>
                              <h5 className="text-xs font-bold text-slate-200">{offer.sellerName}</h5>
                              <p className="text-[9px] text-brand-orange flex items-center gap-0.5 mt-0.5">
                                <Star size={9} fill="currentColor" />
                                {offer.sellerRating} / 5.0 Rating
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right font-mono flex flex-col items-end">
                            <span className="text-white text-xs font-extrabold bg-slate-800/80 px-2 py-0.5 rounded">
                              Offer: ${offer.offerPrice}
                            </span>
                            <span className="text-[8px] text-slate-500 mt-1">
                              {new Date(offer.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>

                        {/* Offer Message */}
                        <p className="text-xs text-slate-300 italic pl-1 leading-relaxed border-l-2 border-brand-orange/30">
                          "{offer.message}"
                        </p>

                        {/* Offer Action Bottom Node */}
                        <div className="flex justify-between items-center pt-1 border-t border-slate-900/40">
                          <div>
                            {offer.status === "Pending" && selectedNeed.status === "Open" && (
                              <button
                                onClick={() => handleAcceptOffer(offer.id)}
                                className="bg-brand-orange hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1 active:scale-95"
                                id={`btn-accept-offer-${offer.id}`}
                              >
                                <ThumbsUp size={11} fill="currentColor" />
                                <span>Accept Offer</span>
                              </button>
                            )}

                            {offer.status === "Pending" && selectedNeed.status !== "Open" && (
                              <span className="text-[9px] text-slate-500 font-mono">
                                Closed (Another bid chosen)
                              </span>
                            )}

                            {isAccepted && (
                              <span className="text-[10px] font-semibold text-brand-teal flex items-center gap-1">
                                <CheckCircle size={12} />
                                Accepted Offer
                              </span>
                            )}

                            {isRejected && (
                              <span className="text-[10px] text-slate-500">
                                Declined
                              </span>
                            )}
                          </div>

                          {/* Quick Message Button */}
                          {isAccepted && (
                            <button
                              onClick={() => onOpenChat(selectedNeed.id, offer.sellerId)}
                              className="text-xs text-brand-blue font-bold flex items-center gap-1 hover:underline cursor-pointer"
                              id={`chat-launcher-${offer.id}`}
                            >
                              <MessageSquare size={13} />
                              <span>Live Chat</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        ) : (
          /* TAB LAYOUTS */
          <div className="p-4 space-y-4">
            
            {/* MY NEEDS TAB */}
            {activeTab === "needs" && (
              <div className="space-y-4">
                {/* Needs Status Header Filters */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                  {(["All", "Open", "In Progress", "Fulfilled"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold transition ${
                        statusFilter === status
                          ? "bg-brand-blue text-slate-950 font-extrabold"
                          : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                      }`}
                      id={`filter-needs-${status}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Needs Feed List */}
                {displayedNeeds.length === 0 ? (
                  <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center space-y-3">
                    <ClipboardList size={30} className="mx-auto text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-400 font-bold">No Needs Listed</p>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">
                        You have no needs in progress under the "{statusFilter}" filter. Tap "Post Need" to list what you want!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayedNeeds.map((need) => (
                      <div
                        key={need.id}
                        onClick={() => setSelectedNeed(need)}
                        className="bg-brand-navy border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3.5 transition duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group"
                        id={`need-card-${need.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                            need.status === "Open" ? "bg-cyan-500/10 text-cyan-400" :
                            need.status === "In Progress" ? "bg-amber-500/10 text-amber-400 animate-pulse" :
                            "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {need.status}
                          </span>
                          <span className="font-mono text-brand-orange text-xs font-bold">
                            ${need.budget}
                          </span>
                        </div>

                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">
                            {need.category}
                          </span>
                          <h4 className="text-xs font-display font-extrabold text-slate-100 group-hover:text-brand-blue transition truncate mt-0.5">
                            {need.title}
                          </h4>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2">
                          {need.description}
                        </p>

                        <div className="flex justify-between items-center text-[9px] font-mono border-t border-slate-900/50 pt-2 text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {need.location.split(",")[0]}
                          </span>
                          
                          <span className="bg-brand-blue/15 text-brand-blue font-bold px-1.5 py-0.5 rounded text-[8px] flex items-center gap-1">
                            {need.offerCount} {need.offerCount === 1 ? "Offer" : "Offers"}
                            <ArrowRight size={8} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* POST NEED FORM TAB */}
            {activeTab === "post" && (
              <div className="bg-brand-navy border border-slate-800 rounded-xl p-4 shadow-xl">
                
                {formSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center mx-auto text-brand-orange animate-bounce">
                      <CheckCircle size={24} />
                    </div>
                    <p className="text-xs font-bold text-white">Need Posted Successfully!</p>
                    <p className="text-[10px] text-slate-400">
                      Sellers are being queried. Returning to dashboard...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <PlusCircle size={15} className="text-brand-orange" />
                      <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-300">
                        Post Your Marketplace Need
                      </h3>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">What do you need?</label>
                      <input
                        type="text"
                        placeholder="e.g. Broken back glass iPhone 14 Pro repair"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-brand-dark/80 border border-slate-850 focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-slate-100 outline-none transition"
                        required
                        id="post-need-title"
                      />
                    </div>

                    {/* Category Picker */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-brand-dark border border-slate-850 rounded-xl px-2.5 py-2 text-xs text-slate-100 outline-none focus:border-brand-blue cursor-pointer"
                        id="post-need-category"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Describe details</label>
                      <textarea
                        placeholder="State parameters: part specifications, requirements, completion deadlines, or background detail."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-brand-dark/80 border border-slate-850 focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-slate-100 outline-none transition resize-none"
                        required
                        id="post-need-description"
                      />
                    </div>

                    {/* Budget & Location Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Budget ($)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-slate-550 text-xs">$</span>
                          <input
                            type="number"
                            placeholder="120"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full bg-brand-dark/80 border border-slate-850 focus:border-brand-blue rounded-xl pl-6 pr-3 py-2 text-xs text-slate-100 outline-none transition"
                            required
                            min="1"
                            id="post-need-budget"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Location Base</label>
                        <input
                          type="text"
                          placeholder="e.g. Oakland, CA"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-brand-dark/80 border border-slate-850 focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-slate-100 outline-none transition"
                          required
                          id="post-need-location"
                        />
                      </div>
                    </div>

                    {/* Submit Form */}
                    <button
                      type="submit"
                      className="w-full cursor-pointer bg-gradient-to-r from-brand-orange to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md hover:opacity-90 active:scale-98 transition"
                      id="post-need-submit-btn"
                    >
                      <PlusCircle size={14} />
                      <span>Publish Direct Need Post</span>
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* RATING REVIEW MODAL */}
      {ratingModalNeed && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-brand-navy border border-slate-800 rounded-2xl p-5 space-y-4 animate-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center mx-auto text-brand-orange mb-2">
                <Star size={20} fill="currentColor" />
              </div>
              <h3 className="text-sm font-display font-extrabold text-white">Rate the Service!</h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Your deal for '{ratingModalNeed.title}' is fulfilled. Share your feedback.
              </p>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-3.5">
              {/* Star selector */}
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRatingScore(starVal)}
                    className="p-1 cursor-pointer transition transform hover:scale-115 text-brand-orange"
                    id={`star-btn-${starVal}`}
                  >
                    <Star
                      size={20}
                      fill={starVal <= ratingScore ? "currentColor" : "none"}
                      stroke="currentColor"
                    />
                  </button>
                ))}
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">Written comment</label>
                <textarea
                  placeholder="Tell us about the seller's reliability, professionalism, pricing, and speed..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-dark border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-blue resize-none"
                  required
                  id="rating-modal-comment"
                />
              </div>

              {/* Action */}
              <button
                type="submit"
                className="w-full cursor-pointer bg-brand-orange text-slate-950 font-bold py-2 rounded-xl text-xs transition hover:opacity-90 active:scale-95 shadow-md"
                id="rating-modal-submit-btn"
              >
                Submit Feedback Stars
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  // Helper method mapping due to unique casing trigger in the interface
  function handleMarkMarkAsCompleteButton(need: Need) {
    handleMarkIdAsFulfilled(need);
  }

  function handleMarkIdAsFulfilled(need: Need) {
    handleMarkStatusAsDone(need);
  }

  function handleMarkStatusAsDone(need: Need) {
    handleMarkFulfilled(need);
  }

};
