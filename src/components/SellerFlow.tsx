import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Need, Offer } from "../types";
import { Search, SlidersHorizontal, MapPin, DollarSign, Calendar, Star, FileText, Send, ChevronRight, CheckCircle2, MessageSquare, ClipboardCheck, ArrowRight } from "lucide-react";

interface SellerFlowProps {
  onOpenChat: (needId: string, partnerId: string) => void;
}

export const SellerFlow: React.FC<SellerFlowProps> = ({ onOpenChat }) => {
  const { allNeeds, allOffers, sendOffer, currentUser } = useApp();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"browse" | "offers">("browse");

  // Detailed view of a need to place an offer
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchLocation, setSearchLocation] = useState("");
  const [budgetLimit, setBudgetLimit] = useState<number>(1000);
  const [showFilters, setShowFilters] = useState(false);

  // Form State for placing offer
  const [bidPrice, setBidPrice] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidSuccess, setBidSuccess] = useState(false);

  if (!currentUser) return null;

  // Filter Needs to browse - only open needs that fit filter parameters and are not posted by current user
  const openNeeds = allNeeds.filter(
    (n) => n.status === "Open" && n.buyerId !== currentUser.id
  );

  const filteredNeeds = openNeeds.filter((need) => {
    const matchesSearch =
      need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || need.category === selectedCategory;
    
    const matchesLocation =
      !searchLocation ||
      need.location.toLowerCase().includes(searchLocation.toLowerCase());
    
    const matchesBudget = need.budget <= budgetLimit;

    return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
  });

  // Seller's sent offers tracker
  const sellerOffers = allOffers.filter((o) => o.sellerId === currentUser.id);

  const selectedNeed = allNeeds.find((n) => n.id === selectedNeedId);
  
  // Check if seller already sent an offer for the selected need
  const existingOfferOnSelected = selectedNeed
    ? allOffers.find((o) => o.needId === selectedNeed.id && o.sellerId === currentUser.id)
    : null;

  const handlePlaceOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNeed || !bidPrice || !bidMessage) return;

    sendOffer(selectedNeed.id, parseFloat(bidPrice), bidMessage);
    setBidSuccess(true);
    setBidPrice("");
    setBidMessage("");

    setTimeout(() => {
      setBidSuccess(false);
      setSelectedNeedId(null);
      setActiveTab("offers"); // auto switch to tracking tab
    }, 1800);
  };

  const CATEGORIES = [
    "All",
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
      
      {/* Seller Header Tabs bar */}
      <div className="h-12 bg-brand-navy border-b border-slate-800/80 px-4 flex items-center justify-between">
        <span className="text-xs font-display font-extrabold text-white tracking-wide">
          {selectedNeedId ? "Respond to Need" : "Seller Marketplace"}
        </span>

        {!selectedNeedId && (
          <div className="flex bg-brand-dark/80 rounded-lg p-1 border border-slate-800/85">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-tight transition cursor-pointer ${
                activeTab === "browse"
                  ? "bg-brand-blue text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              id="seller-tab-browse"
            >
              Browse Needs
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-tight transition cursor-pointer ${
                activeTab === "offers"
                  ? "bg-brand-orange text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              id="seller-tab-offers"
            >
              My Bids ({sellerOffers.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
        
        {/* SUB SCREEN DETAILS & BID BIDDING */}
        {selectedNeedId && selectedNeed ? (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right duration-200">
            <button
              onClick={() => setSelectedNeedId(null)}
              className="text-brand-blue hover:underline text-xs flex items-center gap-1 cursor-pointer font-medium mb-1"
              id="btn-back-to-browse"
            >
              ← Back to Open Feed
            </button>

            {/* Need Core Parameters */}
            <div className="bg-brand-navy p-4 rounded-xl border border-slate-800 space-y-3 shadow-md">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-900/40">
                <div className="flex items-center gap-1.5">
                  <img
                    src={selectedNeed.buyerAvatar}
                    alt={selectedNeed.buyerName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-[11px] font-bold text-slate-200">{selectedNeed.buyerName}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                  Max Budget: ${selectedNeed.budget}
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-wider bg-brand-blue/15 text-brand-blue font-bold px-2 py-0.5 rounded">
                  {selectedNeed.category}
                </span>
                <h3 className="text-sm font-display font-extrabold text-white mt-1.5 leading-snug">
                  {selectedNeed.title}
                </h3>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {selectedNeed.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-slate-500" />
                  {selectedNeed.location}
                </span>
                <span>
                  Posted {new Date(selectedNeed.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* BIDDING DISPATCH FORM */}
            <div className="bg-brand-navy border border-slate-800 rounded-xl p-4 shadow-xl">
              
              {bidSuccess ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center mx-auto text-brand-teal animate-bounce">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-xs font-bold text-white">Proposal Sent Successfully!</p>
                  <p className="text-[10px] text-slate-400">
                    Your bid is registerd under buyer '{selectedNeed.buyerName}'. Redirecting...
                  </p>
                </div>
              ) : existingOfferOnSelected ? (
                <div className="p-4 border border-brand-blue/30 bg-brand-blue/5 rounded-xl space-y-2 text-center">
                  <p className="text-xs font-bold text-slate-200">Already Bidded! 🚀</p>
                  <p className="text-[10px] text-slate-300">
                    You submitted your proposal of <span className="font-mono font-bold text-brand-orange">${existingOfferOnSelected.offerPrice}</span> on {new Date(existingOfferOnSelected.timestamp).toLocaleDateString()}.
                  </p>
                  <div className="pt-2 border-t border-slate-900/50 flex justify-center">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold font-mono uppercase ${
                      existingOfferOnSelected.status === "Pending" ? "bg-amber-500/10 text-amber-400" :
                      existingOfferOnSelected.status === "Accepted" ? "bg-emerald-500/10 text-emerald-400" :
                      "bg-red-500/10 text-red-450"
                    }`}>
                      Bid status: {existingOfferOnSelected.status}
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePlaceOffer} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Send size={13} className="text-brand-orange" />
                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-300">
                      Submit Your Custom Proposal
                    </h4>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Your Proposal Price ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400">$</span>
                      <input
                        type="number"
                        placeholder="e.g. 150"
                        value={bidPrice}
                        onChange={(e) => setBidPrice(e.target.value)}
                        className="w-full bg-brand-dark border border-slate-850 rounded-xl pl-6 pr-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-blue font-mono select-none"
                        required
                        max={selectedNeed.budget * 1.5} // allow reasonable bids above max budget
                        id="bid-offer-price"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Proposal message to buyer</label>
                    <textarea
                      placeholder="Introduce your expertise, describe how you resolve their exact specifications, specify timing availability..."
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-brand-dark/80 border border-slate-850 focus:border-brand-blue rounded-xl px-3 py-2 text-xs text-slate-100 outline-none transition resize-none"
                      required
                      id="bid-offer-message"
                    />
                  </div>

                  {/* Submit Proposals */}
                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-gradient-to-r from-brand-orange to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
                    id="submit-proposal-btn"
                  >
                    <Send size={13} />
                    <span>Send Offer to Buyer</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        ) : (
          /* TAB LAYOUTS */
          <div className="p-4 space-y-4">
            
            {/* BROWSE TAB */}
            {activeTab === "browse" && (
              <div className="space-y-3">
                {/* Search and Filters Header */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-brand-navy border border-slate-800 focus:border-brand-blue rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 outline-none transition"
                      id="search-needs"
                    />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                      showFilters
                        ? "border-brand-orange bg-brand-orange/10 text-white"
                        : "border-slate-800 bg-brand-navy text-slate-400 hover:text-white"
                    }`}
                    id="btn-toggle-filters"
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                </div>

                {/* ADVANCED FILTER DRAWER PANEL */}
                {showFilters && (
                  <div className="p-3.5 bg-brand-navy border border-slate-805/80 rounded-xl space-y-3.5 animate-in slide-in-from-top duration-200">
                    
                    {/* Categories tag list */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Pill category</label>
                      <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`cursor-pointer px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight border transition ${
                              selectedCategory === cat
                                ? "bg-brand-blue border-brand-blue text-slate-950 font-extrabold"
                                : "bg-brand-dark/50 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                            id={`category-filter-btn-${cat}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location and Budget limit inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400">Location city</label>
                        <input
                          type="text"
                          placeholder="e.g. Oakland"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="w-full bg-brand-dark border border-slate-850 px-2.5 py-1.5 text-[11px] text-slate-200 outline-none rounded-lg focus:border-brand-blue"
                          id="filter-location-city"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 flex justify-between">
                          <span>Max Budget:</span>
                          <span className="font-mono text-brand-orange font-bold text-[10px]">${budgetLimit}</span>
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="1500"
                          step="50"
                          value={budgetLimit}
                          onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                          className="w-full h-1 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-brand-orange mt-2.5"
                          id="filter-budget-slider"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Browsing Feed list */}
                {filteredNeeds.length === 0 ? (
                  <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center space-y-2">
                    <p className="text-slate-500 text-xs font-semibold">No Matching Open Needs</p>
                    <p className="text-[10px] text-slate-650 max-w-xs mx-auto">
                      All caught up! Adjust filters or wait until buyers publish new tasks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNeeds.map((need) => {
                      const hasBidOnThis = allOffers.find((o) => o.needId === need.id && o.sellerId === currentUser.id);
                      return (
                        <div
                          key={need.id}
                          onClick={() => setSelectedNeedId(need.id)}
                          className="bg-brand-navy border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 cursor-pointer transition duration-150 flex flex-col justify-between space-y-3 relative group"
                          id={`browse-card-${need.id}`}
                        >
                          {/* Card stats top */}
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] uppercase tracking-wider font-extrabold bg-brand-blue/15 text-brand-blue px-2 py-0.5 rounded">
                              {need.category}
                            </span>
                            
                            <span className="font-mono text-brand-orange text-xs font-extrabold">
                              ${need.budget} Max
                            </span>
                          </div>

                          {/* Post title */}
                          <div>
                            <h4 className="text-xs font-display font-extrabold text-slate-100 group-hover:text-brand-orange transition truncate">
                              {need.title}
                            </h4>
                            <p className="text-[10px] text-slate-450 mt-1 flex items-center gap-1.5 font-mono">
                              <MapPin size={9} />
                              {need.location}
                              <span className="text-slate-600 font-sans">• Posted by {need.buyerName.split(" ")[0]}</span>
                            </p>
                          </div>

                          {/* Preview snippet */}
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {need.description}
                          </p>

                          {/* Footer details */}
                          <div className="flex justify-between items-center text-[8px] font-mono pt-2 border-t border-slate-900/60 text-slate-500">
                            <span>
                              {need.offerCount} bids placed
                            </span>

                            {hasBidOnThis ? (
                              <span className="text-[9px] font-semibold text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded">
                                Bid Placed: ${hasBidOnThis.offerPrice}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-brand-orange flex items-center gap-0.5 hover:underline">
                                Bid Now <ChevronRight size={10} />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* MY SENT OFFERS TAB */}
            {activeTab === "offers" && (
              <div className="space-y-3.5">
                <h4 className="text-xs font-display font-bold text-slate-300 uppercase tracking-widest pl-1">
                  Sent Proposals Tracker ({sellerOffers.length})
                </h4>

                {sellerOffers.length === 0 ? (
                  <div className="p-10 border border-dashed border-slate-800 rounded-xl text-center space-y-2">
                    <p className="text-slate-500 text-xs">No Bids Placed Yet</p>
                    <p className="text-[10px] text-slate-650 max-w-xs mx-auto">
                      Browse open need slots and submit price bids to be listed here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sellerOffers.map((offer) => {
                      const isAccepted = offer.status === "Accepted";
                      const isRejected = offer.status === "Rejected";

                      return (
                        <div
                          key={offer.id}
                          className={`p-3.5 border rounded-xl flex flex-col space-y-2.5 transition duration-200 ${
                            isAccepted
                              ? "border-brand-teal/40 bg-brand-teal/8"
                              : isRejected
                              ? "border-slate-850 bg-slate-900/25 opacity-70"
                              : "border-slate-800 bg-brand-navy"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="text-xs font-bold text-slate-200 truncate pr-2 max-w-[70%]">
                              {offer.needTitle}
                            </h5>
                            
                            <span className={`text-[8.5px] font-bold font-mono px-2 py-0.5 rounded uppercase leading-none ${
                              offer.status === "Pending" ? "bg-amber-500/15 text-amber-400" :
                              offer.status === "Accepted" ? "bg-emerald-500/15 text-emerald-400" :
                              "bg-red-500/15 text-red-400"
                            }`}>
                              {offer.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                            <span>
                              Bid: <span className="text-brand-orange font-bold">${offer.offerPrice}</span>
                            </span>
                            <span>
                              Placed {new Date(offer.timestamp).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-350 italic bg-brand-dark/25 px-2.5 py-1.5 rounded border border-slate-850">
                            "{offer.message}"
                          </p>

                          {/* Accepted action launcher */}
                          {isAccepted && (
                            <div className="flex justify-between items-center pt-2 border-t border-slate-900/40">
                              <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                <CheckCircle2 size={11} className="text-brand-teal" />
                                Deal Awarded!
                              </span>
                              
                              <button
                                onClick={() => onOpenChat(offer.needId, offer.buyerId)}
                                className="text-[10px] text-brand-blue font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                id={`chat-button-${offer.id}`}
                              >
                                <MessageSquare size={12} />
                                <span>Message Buyer</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
