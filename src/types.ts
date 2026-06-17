export type UserRole = "buyer" | "seller" | "both";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  rating: number;
  ratingCount: number;
  joinedDate: string;
  avatar: string; // fallback init icon or image
  location: string;
  about?: string;
}

export type NeedStatus = "Open" | "In Progress" | "Fulfilled";

export interface Need {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: NeedStatus;
  timestamp: string; // ISO string
  offerCount: number;
}

export type OfferStatus = "Pending" | "Accepted" | "Rejected";

export interface Offer {
  id: string;
  needId: string;
  needTitle: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  offerPrice: number;
  message: string;
  status: OfferStatus;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  needId: string;
  message: string;
  timestamp: string;
}

export interface Rating {
  id: string;
  raterId: string;
  raterName: string;
  raterAvatar: string;
  ratedId: string;
  needId: string;
  needTitle: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "offer_received" | "offer_status" | "message" | "system";
  timestamp: string;
  read: boolean;
  linkId: string; // e.g. needId or offerId for context mapping
}
