import React, { createContext, useContext, useState } from "react";

export interface Bid {
  id: string;
  taskId: string;
  bidderId: string;
  bidderName: string;
  bidderRating: number;
  bidderCompletedTasks: number;
  amount: number;
  message: string;
  deliveryTime: string;
  submittedAt: string;
  isAccepted?: boolean;
  bidderVerified: boolean;
  bidderResponse: string;
}

interface BidContextType {
  bids: Bid[];
  addBid: (bid: Omit<Bid, "id" | "submittedAt">) => void;
  getBidsByTask: (taskId: string) => Bid[];
  acceptBid: (bidId: string, taskId: string) => void;
  updateBid: (bidId: string, updates: Partial<Bid>) => void;
}

const BidContext = createContext<BidContextType | undefined>(undefined);

// Default sample bids
const defaultBids: Bid[] = [
  {
    id: "bid_1",
    taskId: "1",
    bidderId: "tasker_1",
    bidderName: "Mike Wilson",
    bidderRating: 4.9,
    bidderCompletedTasks: 127,
    amount: 70,
    message:
      "I have 15+ years of plumbing experience and can fix this today. I carry all necessary tools and parts.",
    deliveryTime: "Same day",
    submittedAt: "2024-01-15T11:15:00Z",
    bidderVerified: true,
    bidderResponse: "under 1 hour",
  },
  {
    id: "bid_2",
    taskId: "1",
    bidderId: "tasker_2",
    bidderName: "John Smith",
    bidderRating: 4.7,
    bidderCompletedTasks: 89,
    amount: 65,
    message:
      "Experienced plumber available this afternoon. I guarantee my work and provide 30-day warranty.",
    deliveryTime: "Today",
    submittedAt: "2024-01-15T12:30:00Z",
    bidderVerified: true,
    bidderResponse: "under 2 hours",
  },
  {
    id: "bid_3",
    taskId: "1",
    bidderId: "tasker_3",
    bidderName: "David Brown",
    bidderRating: 4.6,
    bidderCompletedTasks: 45,
    amount: 80,
    message:
      "I can fix this properly with quality parts. Available tomorrow morning.",
    deliveryTime: "1-2 days",
    submittedAt: "2024-01-15T14:45:00Z",
    bidderVerified: false,
    bidderResponse: "under 4 hours",
  },
];

export function BidProvider({ children }: { children: React.ReactNode }) {
  const [bids, setBids] = useState<Bid[]>(defaultBids);

  const addBid = (bidData: Omit<Bid, "id" | "submittedAt">) => {
    const newBid: Bid = {
      ...bidData,
      id: `bid_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };

    setBids((prev) => [newBid, ...prev]);
  };

  const getBidsByTask = (taskId: string) => {
    return bids.filter((bid) => bid.taskId === taskId);
  };

  const acceptBid = (bidId: string, taskId: string) => {
    setBids((prev) =>
      prev.map((bid) => {
        if (bid.taskId === taskId) {
          return {
            ...bid,
            isAccepted: bid.id === bidId ? true : false,
          };
        }
        return bid;
      }),
    );
  };

  const updateBid = (bidId: string, updates: Partial<Bid>) => {
    setBids((prev) =>
      prev.map((bid) => (bid.id === bidId ? { ...bid, ...updates } : bid)),
    );
  };

  return (
    <BidContext.Provider
      value={{
        bids,
        addBid,
        getBidsByTask,
        acceptBid,
        updateBid,
      }}
    >
      {children}
    </BidContext.Provider>
  );
}

export function useBids() {
  const context = useContext(BidContext);
  if (context === undefined) {
    throw new Error("useBids must be used within a BidProvider");
  }
  return context;
}
