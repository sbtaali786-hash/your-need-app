import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  Need,
  Offer,
  Message,
  Rating,
  AppNotification,
  NeedStatus,
  OfferStatus,
  UserRole,
} from "../types";

interface AppContextType {
  currentUser: UserProfile | null;
  allNeeds: Need[];
  allOffers: Offer[];
  allMessages: Message[];
  allRatings: Rating[];
  allUsers: UserProfile[];
  notifications: AppNotification[];
  signUp: (name: string, email: string, phone: string, role: UserRole) => UserProfile;
  logIn: (email: string) => UserProfile | null;
  logOut: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  createNeed: (title: string, description: string, category: string, budget: number, location: string) => Need;
  sendOffer: (needId: string, offerPrice: number, message: string) => Offer;
  acceptOffer: (offerId: string) => void;
  markNeedFulfilled: (needId: string) => void;
  submitRating: (needId: string, sellerId: string, ratingScore: number, comment: string) => void;
  sendChatMessage: (needId: string, receiverId: string, messageText: string) => Message;
  markNotificationsRead: () => void;
  triggerAIResponse: (need: Need) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Core Seed Users
const SEED_USERS: UserProfile[] = [
  {
    id: "user_b1",
    name: "Alex Rivera",
    email: "alex@example.com",
    phone: "415-555-1200",
    role: "buyer",
    rating: 5,
    ratingCount: 1,
    joinedDate: "2026-03-10",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    location: "San Francisco, CA",
    about: "Tech startup designer. Regularly post home repair, electronics fixing, and furniture builds.",
  },
  {
    id: "user_s1",
    name: "Marcus Miller",
    email: "marcus@example.com",
    phone: "510-555-1950",
    role: "seller",
    rating: 4.8,
    ratingCount: 14,
    joinedDate: "2026-01-15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    location: "Oakland, CA",
    about: "Professional carpenter, woodworker and home improvement handler with 8+ years experience.",
  },
  {
    id: "user_s2",
    name: "Elena Rostova",
    email: "elena@example.com",
    phone: "408-555-2201",
    role: "seller",
    rating: 4.9,
    ratingCount: 22,
    joinedDate: "2026-02-01",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    location: "San Jose, CA",
    about: "Certified Apple & Android technician. Fast turnarounds, screens, batteries, motherboard diagnostics.",
  },
  {
    id: "user_s3",
    name: "Kenji Sato",
    email: "kenji@example.com",
    phone: "415-555-3341",
    role: "seller",
    rating: 4.7,
    ratingCount: 9,
    joinedDate: "2026-04-12",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    location: "San Francisco, CA",
    about: "Certified Math & Physics tutor, current collegiate instructor. Love making math intuitive and fun.",
  }
];

// Core Seed Needs
const SEED_NEEDS: Need[] = [
  {
    id: "need_1",
    buyerId: "user_b1",
    buyerName: "Alex Rivera",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    title: "Repair cracked screen on iPhone 15 Pro",
    description: "Dropped my screen on the pavement yesterday. Liquid crystal display and touch still react perfectly, but the outer glass is severely shattered. Looking for a high-quality glass replacement. Can drop it off anywhere in San Francisco. Please offer your price and estimated duration.",
    category: "Electronics",
    budget: 160,
    location: "San Francisco, CA",
    status: "Open",
    timestamp: "2026-06-16T18:30:00Z",
    offerCount: 2,
  },
  {
    id: "need_2",
    buyerId: "user_b1",
    buyerName: "Alex Rivera",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    title: "Custom solid oak dining table 6-seater",
    description: "Looking for a woodworking artisan to craft a minimalist solid oak or ash dining table (approx. 72 x 36 inches). Prefer simple, stout dowel legs and soft rectangular contours. Matte natural sealer. No laminate/particle board please.",
    category: "Furniture",
    budget: 850,
    location: "Oakland, CA",
    status: "Open",
    timestamp: "2026-06-15T12:00:00Z",
    offerCount: 1,
  },
  {
    id: "need_3",
    buyerId: "user_b1",
    buyerName: "Alex Rivera",
    buyerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    title: "Algebra II tutoring for high schooler",
    description: "My daughter needs some math confidence. Specifically looking for Algebra II topics like polynomials, quadratic formulas and geometry proofs. 1-hour sessions, remote zoom sessions preferred, twice per week.",
    category: "Lessons / Tutor",
    budget: 45,
    location: "Remote / Online",
    status: "Fulfilled",
    timestamp: "2026-06-10T10:00:00Z",
    offerCount: 1,
  }
];

// Core Seed Offers
const SEED_OFFERS: Offer[] = [
  {
    id: "offer_1",
    needId: "need_1",
    needTitle: "Repair cracked screen on iPhone 15 Pro",
    buyerId: "user_b1",
    sellerId: "user_s2",
    sellerName: "Elena Rostova",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    sellerRating: 4.9,
    offerPrice: 145,
    message: "Hi Alex! Under budget, I have authentic OEM screens for high quality glass laminating and full warranty. Takes me 45 minutes at my shop in SOMA. Available evenings!",
    status: "Pending",
    timestamp: "2026-06-16T19:05:00Z",
  },
  {
    id: "offer_2",
    needId: "need_1",
    needTitle: "Repair cracked screen on iPhone 15 Pro",
    buyerId: "user_b1",
    sellerId: "user_s1",
    sellerName: "Marcus Miller",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    sellerRating: 4.8,
    offerPrice: 160,
    message: "I can take care of this on-site! I have a mobile tech kit and will drive to your home or office. Takes 1 hour. Certified work, let me know!",
    status: "Pending",
    timestamp: "2026-06-16T21:14:00Z",
  },
  {
    id: "offer_3",
    needId: "need_2",
    needTitle: "Custom solid oak dining table 6-seater",
    buyerId: "user_b1",
    sellerId: "user_s1",
    sellerName: "Marcus Miller",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    sellerRating: 4.8,
    offerPrice: 800,
    message: "Perfect project! Solid white oak, sustainably sourced. I've finished 4 tables with the exact specs you described this year. Natural Rubio Monocoat finish. Free delivery to Oakland/SF included.",
    status: "Pending",
    timestamp: "2026-06-15T15:30:00Z",
  },
  {
    id: "offer_4",
    needId: "need_3",
    needTitle: "Algebra II tutoring for high schooler",
    buyerId: "user_b1",
    sellerId: "user_s3",
    sellerName: "Kenji Sato",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    sellerRating: 4.7,
    offerPrice: 40,
    message: "Hi! I am super interested. Have tutored Algebra II for 4 years on Zoom. I focus on interactive sketching and practice sheets. I charge $40/hr, can begin this Tuesday.",
    status: "Accepted",
    timestamp: "2026-06-10T12:00:00Z",
  }
];

// Core Seed Ratings
const SEED_RATINGS: Rating[] = [
  {
    id: "rating_1",
    raterId: "user_b1",
    raterName: "Alex Rivera",
    raterAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    ratedId: "user_s3",
    needId: "need_3",
    needTitle: "Algebra II tutoring for high schooler",
    rating: 5,
    comment: "Kenji is an absolutely amazing tutor! He explains formulas logically and my daughter went from a C- to an A in algebra within 4 weeks. Highly recommend!",
    timestamp: "2026-06-14T18:00:00Z",
  }
];

// Core Seed Notifications
const SEED_NOTIFS: AppNotification[] = [
  {
    id: "notif_1",
    userId: "user_b1",
    title: "New offer received",
    body: "Elena Rostova submitted an offer ($145) for Your Need 'iPhone 15 screen'",
    type: "offer_received",
    timestamp: "2026-06-16T19:05:00Z",
    read: false,
    linkId: "need_1",
  },
  {
    id: "notif_2",
    userId: "user_b1",
    title: "New offer received",
    body: "Marcus Miller submitted an offer ($160) for Your Need 'iPhone 15 screen'",
    type: "offer_received",
    timestamp: "2026-06-16T21:14:00Z",
    read: true,
    linkId: "need_1",
  }
];

const SEED_MESSAGES: Message[] = [
  {
    id: "msg_1",
    senderId: "user_b1",
    receiverId: "user_s3",
    needId: "need_3",
    message: "Hi Kenji! Glad you responded. When can we start the first trial math session?",
    timestamp: "2026-06-10T13:00:00Z",
  },
  {
    id: "msg_2",
    senderId: "user_s3",
    receiverId: "user_b1",
    needId: "need_3",
    message: "Thanks Alex! Does Tuesday 5 PM work for you? I can send over a Zoom link.",
    timestamp: "2026-06-10T13:10:00Z",
  },
  {
    id: "msg_3",
    senderId: "user_b1",
    receiverId: "user_s3",
    needId: "need_3",
    message: "Perfect, we'll see you then! Thanks for the quick response.",
    timestamp: "2026-06-10T13:15:00Z",
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem("yn_current_user");
    return cached ? JSON.parse(cached) : null;
  });

  const [allNeeds, setAllNeeds] = useState<Need[]>(() => {
    const cached = localStorage.getItem("yn_needs");
    return cached ? JSON.parse(cached) : SEED_NEEDS;
  });

  const [allOffers, setAllOffers] = useState<Offer[]>(() => {
    const cached = localStorage.getItem("yn_offers");
    return cached ? JSON.parse(cached) : SEED_OFFERS;
  });

  const [allMessages, setAllMessages] = useState<Message[]>(() => {
    const cached = localStorage.getItem("yn_messages");
    return cached ? JSON.parse(cached) : SEED_MESSAGES;
  });

  const [allRatings, setAllRatings] = useState<Rating[]>(() => {
    const cached = localStorage.getItem("yn_ratings");
    return cached ? JSON.parse(cached) : SEED_RATINGS;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const cached = localStorage.getItem("yn_users");
    return cached ? JSON.parse(cached) : SEED_USERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const cached = localStorage.getItem("yn_notifications");
    return cached ? JSON.parse(cached) : SEED_NOTIFS;
  });

  // Keep Sync with Storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("yn_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("yn_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("yn_needs", JSON.stringify(allNeeds));
  }, [allNeeds]);

  useEffect(() => {
    localStorage.setItem("yn_offers", JSON.stringify(allOffers));
  }, [allOffers]);

  useEffect(() => {
    localStorage.setItem("yn_messages", JSON.stringify(allMessages));
  }, [allMessages]);

  useEffect(() => {
    localStorage.setItem("yn_ratings", JSON.stringify(allRatings));
  }, [allRatings]);

  useEffect(() => {
    localStorage.setItem("yn_users", JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem("yn_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Auth Operations
  const signUp = (name: string, email: string, phone: string, role: UserRole): UserProfile => {
    const defaultAvatarMap = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    ];
    const userAvatar = defaultAvatarMap[Math.floor(Math.random() * defaultAvatarMap.length)];

    const newUser: UserProfile = {
      id: "user_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      role,
      rating: role === "buyer" ? 0 : 5.0, // initial rating stars
      ratingCount: role === "buyer" ? 0 : 1,
      joinedDate: new Date().toISOString().substring(0, 10),
      avatar: userAvatar,
      location: "San Francisco, CA",
      about: `Active ${role} on YOUR NEED. Focused on quick turnarounds and high reliability.`,
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Initial sign-up notification
    const signupNotif: AppNotification = {
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      userId: newUser.id,
      title: "Welcome to YOUR NEED!",
      body: `Thank you for joining as a ${role}. Post, bid and trade instantly.`,
      type: "system",
      timestamp: new Date().toISOString(),
      read: false,
      linkId: "welcome",
    };
    setNotifications((prev) => [signupNotif, ...prev]);

    return newUser;
  };

  const logIn = (email: string): UserProfile | null => {
    const user = allUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logOut = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newer = { ...currentUser, ...updated };
    setCurrentUser(newer);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? newer : u)));
  };

  // Marketplace Operations
  const createNeed = (
    title: string,
    description: string,
    category: string,
    budget: number,
    location: string
  ): Need => {
    if (!currentUser) throw new Error("Auth required");
    const newNeed: Need = {
      id: "need_" + Math.random().toString(36).substr(2, 9),
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      title,
      description,
      category,
      budget,
      location,
      status: "Open",
      timestamp: new Date().toISOString(),
      offerCount: 0,
    };

    setAllNeeds((prev) => [newNeed, ...prev]);

    // Automatically simulate a professional response after 8 seconds of posting!
    setTimeout(() => {
      triggerAIResponse(newNeed);
    }, 8000);

    return newNeed;
  };

  // Simulate an AI/competitor seller submitting a competitive offer
  const triggerAIResponse = (need: Need) => {
    const professionalReplies = [
      {
        name: "Marcus Miller",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 4.8,
        id: "user_s1",
        priceOffset: 0.9, // 10% lower
        msg: "Hi! I saw your need and I would love to assist. I specialize in this exact category and am highly rated for it in the local area. I can complete it faster than estimated and can bring my own equipment."
      },
      {
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        rating: 4.9,
        id: "user_s2",
        priceOffset: 0.95, // 5% lower
        msg: "Greetings. I can begin working on this immediately. Available on-site or remote. I hold high badges for service delivery in this division. Looking forward to working together."
      },
      {
        name: "Kenji Sato",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        rating: 4.7,
        id: "user_s3",
        priceOffset: 0.85, // 15% discount
        msg: "Hey there! I am local of the area and can fulfill this today. Placed a solid bid for your review. Let's start chat first to arrange logistics!"
      }
    ];

    // Pick a matching seller
    const seller = professionalReplies[Math.floor(Math.random() * professionalReplies.length)];
    const price = Math.round(need.budget * seller.priceOffset);

    const offerId = "offer_sim_" + Math.random().toString(36).substr(2, 9);
    const newOffer: Offer = {
      id: offerId,
      needId: need.id,
      needTitle: need.title,
      buyerId: need.buyerId,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerAvatar: seller.avatar,
      sellerRating: seller.rating,
      offerPrice: price,
      message: seller.msg,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    setAllOffers((prev) => [newOffer, ...prev]);
    setAllNeeds((prev) =>
      prev.map((n) => (n.id === need.id ? { ...n, offerCount: n.offerCount + 1 } : n))
    );

    // Send Notification to Buyer
    const newNotif: AppNotification = {
      id: "notif_sim_" + Math.random().toString(36).substr(2, 9),
      userId: need.buyerId,
      title: "New Competitive Offer!",
      body: `${seller.name} submitted an offer of $${price} for '${need.title}'`,
      type: "offer_received",
      timestamp: new Date().toISOString(),
      read: false,
      linkId: need.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const sendOffer = (needId: string, offerPrice: number, message: string): Offer => {
    if (!currentUser) throw new Error("Auth required");
    const need = allNeeds.find((n) => n.id === needId);
    if (!need) throw new Error("Need not found");

    const newOffer: Offer = {
      id: "offer_" + Math.random().toString(36).substr(2, 9),
      needId,
      needTitle: need.title,
      buyerId: need.buyerId,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerRating: currentUser.rating,
      offerPrice,
      message,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    setAllOffers((prev) => [newOffer, ...prev]);
    setAllNeeds((prev) =>
      prev.map((n) => (n.id === needId ? { ...n, offerCount: n.offerCount + 1 } : n))
    );

    // Notify Buyer
    const buyerNotif: AppNotification = {
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      userId: need.buyerId,
      title: "New Offer Received!",
      body: `${currentUser.name} offered $${offerPrice} for your post: '${need.title}'`,
      type: "offer_received",
      timestamp: new Date().toISOString(),
      read: false,
      linkId: needId,
    };
    setNotifications((prev) => [buyerNotif, ...prev]);

    // Simulate auto-accept scenario / feedback after 12 seconds
    return newOffer;
  };

  const acceptOffer = (offerId: string) => {
    const offer = allOffers.find((o) => o.id === offerId);
    if (!offer) return;

    // Set offer status to accepted, other pending offers for this need are rejected
    setAllOffers((prev) =>
      prev.map((o) => {
        if (o.id === offerId) return { ...o, status: "Accepted" };
        if (o.needId === offer.needId && o.status === "Pending") return { ...o, status: "Rejected" };
        return o;
      })
    );

    // Move Need to 'In Progress'
    setAllNeeds((prev) =>
      prev.map((n) => (n.id === offer.needId ? { ...n, status: "In Progress" } : n))
    );

    // Notify Seller
    const sellerNotif: AppNotification = {
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      userId: offer.sellerId,
      title: "Offer Accepted! 🎉",
      body: `Your offer of $${offer.offerPrice} for '${offer.needTitle}' was accepted!`,
      type: "offer_status",
      timestamp: new Date().toISOString(),
      read: false,
      linkId: offer.needId,
    };
    setNotifications((prev) => [sellerNotif, ...prev]);

    // Send automated first chat message
    const botMsg: Message = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      senderId: offer.buyerId,
      receiverId: offer.sellerId,
      needId: offer.needId,
      message: "Hey! I've accepted your offer. Looking forward to getting this sorted out. Let me know when you are available!",
      timestamp: new Date().toISOString(),
    };
    setAllMessages((prev) => [...prev, botMsg]);
  };

  const markNeedFulfilled = (needId: string) => {
    setAllNeeds((prev) =>
      prev.map((n) => (n.id === needId ? { ...n, status: "Fulfilled" } : n))
    );

    // Find the accepted offer to send notifications
    const acceptedOffer = allOffers.find((o) => o.needId === needId && o.status === "Accepted");
    if (acceptedOffer) {
      // Notify seller
      const sellerNotif: AppNotification = {
        id: "notif_" + Math.random().toString(36).substr(2, 9),
        userId: acceptedOffer.sellerId,
        title: "Deal Completed! 🌟",
        body: `Buyer marked '${acceptedOffer.needTitle}' as Fulfilled! Please rate your experience.`,
        type: "offer_status",
        timestamp: new Date().toISOString(),
        read: false,
        linkId: needId,
      };
      setNotifications((prev) => [sellerNotif, ...prev]);
    }
  };

  const submitRating = (
    needId: string,
    sellerId: string,
    ratingScore: number,
    comment: string
  ) => {
    if (!currentUser) return;
    const need = allNeeds.find((n) => n.id === needId);
    const title = need ? need.title : "Completed Offer";

    const newRating: Rating = {
      id: "rating_" + Math.random().toString(36).substr(2, 9),
      raterId: currentUser.id,
      raterName: currentUser.name,
      raterAvatar: currentUser.avatar,
      ratedId: sellerId,
      needId,
      needTitle: title,
      rating: ratingScore,
      comment,
      timestamp: new Date().toISOString(),
    };

    setAllRatings((prev) => [newRating, ...prev]);

    // Dynamically calculate the seller's new average rating
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === sellerId) {
          const totalRating = u.rating * u.ratingCount + ratingScore;
          const newCount = u.ratingCount + 1;
          return {
            ...u,
            ratingCount: newCount,
            rating: parseFloat((totalRating / newCount).toFixed(1)),
          };
        }
        return u;
      })
    );

    // Also update current state if self is same
    if (currentUser.id === sellerId) {
      const totalRating = currentUser.rating * currentUser.ratingCount + ratingScore;
      const newCount = currentUser.ratingCount + 1;
      setCurrentUser({
        ...currentUser,
        ratingCount: newCount,
        rating: parseFloat((totalRating / newCount).toFixed(1)),
      });
    }

    // Notify seller
    const ratingNotif: AppNotification = {
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      userId: sellerId,
      title: "New Review Received! ⭐",
      body: `${currentUser.name} rated you ${ratingScore} Stars: "${comment.substring(0, 30)}..."`,
      type: "offer_status",
      timestamp: new Date().toISOString(),
      read: false,
      linkId: needId,
    };
    setNotifications((prev) => [ratingNotif, ...prev]);
  };

  const sendChatMessage = (
    needId: string,
    receiverId: string,
    messageText: string
  ): Message => {
    if (!currentUser) throw new Error("Authentication required");
    const newMsg: Message = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      receiverId,
      needId,
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    setAllMessages((prev) => [...prev, newMsg]);

    // Send Real-time notification to receipt User (optional) but nice
    const msgNotif: AppNotification = {
      id: "notif_msg_" + Math.random().toString(36).substr(2, 9),
      userId: receiverId,
      title: `Message from ${currentUser.name}`,
      body: messageText.length > 50 ? `${messageText.substring(0, 47)}...` : messageText,
      type: "message",
      timestamp: new Date().toISOString(),
      read: false,
      linkId: needId,
    };
    setNotifications((prev) => [msgNotif, ...prev]);

    // Automatically simulate a helpful reply from the professional seller after 4 seconds of chat!
    if (receiverId === "user_s1" || receiverId === "user_s2" || receiverId === "user_s3") {
      setTimeout(() => {
        const botAnswers = [
          "Perfect! Let's arrange a time. Does tomorrow at noon work?",
          "Wonderful, I'll package up the exact tools for this. Could you share the precise address or online link?",
          "Understood! Ready to roll. I'll message you when heading over.",
          "Awesome. Thank you for choosing my bid. I am looking forward to proving my top ranking!"
        ];
        const randomAnswer = botAnswers[Math.floor(Math.random() * botAnswers.length)];
        const replyMsg: Message = {
          id: "msg_" + Math.random().toString(36).substr(2, 9),
          senderId: receiverId,
          receiverId: currentUser.id,
          needId,
          message: randomAnswer,
          timestamp: new Date().toISOString(),
        };
        setAllMessages((prev) => [...prev, replyMsg]);

        // Send Notification to user for incoming message
        const backNotif: AppNotification = {
          id: "notif_msg_back_" + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          title: `Reply from ${allUsers.find(u => u.id === receiverId)?.name || "Partner"}`,
          body: randomAnswer,
          type: "message",
          timestamp: new Date().toISOString(),
          read: false,
          linkId: needId,
        };
        setNotifications((prev) => [backNotif, ...prev]);
      }, 4000);
    }

    return newMsg;
  };

  const markNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allNeeds,
        allOffers,
        allMessages,
        allRatings,
        allUsers,
        notifications: notifications.filter((n) => !currentUser || n.userId === currentUser.id),
        signUp,
        logIn,
        logOut,
        updateProfile,
        createNeed,
        sendOffer,
        acceptOffer,
        markNeedFulfilled,
        submitRating,
        sendChatMessage,
        markNotificationsRead,
        triggerAIResponse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside the AppProvider");
  return context;
};
