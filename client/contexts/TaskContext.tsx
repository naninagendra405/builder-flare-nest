import React, { createContext, useContext, useState, useCallback } from "react";

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

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  location: string;
  isRemote: boolean;
  customerName: string;
  customerId: string;
  customerRating: number;
  customerVerified: boolean;
  postedAt: string;
  deadline?: string;
  urgency: "low" | "medium" | "high";
  skillsRequired: string[];
  bidsCount: number;
  viewsCount: number;
  images: string[];
  timeEstimate: string;
  status:
    | "open"
    | "bid_accepted"
    | "approved"
    | "in_progress"
    | "completed"
    | "cancelled";
  instructions?: string;
  distance?: number;
  assignedTaskerId?: string;
  assignedTaskerName?: string;
  acceptedBidId?: string;
  escrowAmount?: number;
  escrowStatus?: "pending" | "held" | "released" | "refunded";
  customerApproval?: boolean;
  taskerCompleted?: boolean;
  customerCompleted?: boolean;
  completedAt?: string;
  paymentReleased?: boolean;
  adminCommission?: number;
  taskerPayment?: number;
}

interface TaskContextType {
  tasks: Task[];
  bids: Bid[];
  addTask: (
    task: Omit<Task, "id" | "postedAt" | "bidsCount" | "viewsCount" | "status">,
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getTasksByUser: (userId: string) => Task[];
  getAllTasks: () => Task[];
  acceptBid: (
    taskId: string,
    bidId: string,
    taskerId: string,
    taskerName: string,
  ) => void;
  getTasksByTasker: (taskerId: string) => Task[];
  approveTaskAndHoldEscrow: (taskId: string) => void;
  markTaskCompleted: (
    taskId: string,
    userId: string,
    userRole: "customer" | "tasker",
  ) => void;
  releasePayment: (taskId: string) => void;
  placeBid: (
    taskId: string,
    bidData: Omit<Bid, "id" | "taskId" | "submittedAt">,
  ) => void;
  getBidsForTask: (taskId: string) => Bid[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Default sample tasks
const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Fix leaky kitchen sink",
    description:
      "My kitchen sink has been leaking for a week. Need someone experienced with plumbing to fix it. All necessary tools provided.",
    category: "Home Repair",
    budget: 75,
    budgetType: "fixed",
    location: "Manhattan, NY",
    isRemote: false,
    customerName: "Sarah Johnson",
    customerId: "customer_1",
    customerRating: 4.8,
    customerVerified: true,
    postedAt: "2024-01-15T10:30:00Z",
    deadline: "2024-01-18T17:00:00Z",
    urgency: "high",
    skillsRequired: ["Plumbing", "Repair"],
    bidsCount: 12,
    viewsCount: 67,
    images: [],
    timeEstimate: "2-3 hours",
    status: "open",
    instructions:
      "Please text me when you arrive. Building entrance is on 5th Street.",
  },
  {
    id: "2",
    title: "Logo design for tech startup",
    description:
      "Looking for a creative designer to create a modern logo for our AI startup. Need vector files and multiple variations.",
    category: "Digital Services",
    budget: 250,
    budgetType: "fixed",
    location: "Remote",
    isRemote: true,
    customerName: "TechCorp Inc.",
    customerId: "customer_2",
    customerRating: 4.9,
    customerVerified: true,
    postedAt: "2024-01-14T14:15:00Z",
    urgency: "medium",
    skillsRequired: ["Graphic Design", "Branding", "Adobe Illustrator"],
    bidsCount: 24,
    viewsCount: 156,
    images: [],
    timeEstimate: "3-5 days",
    status: "open",
  },
  {
    id: "3",
    title: "Help with apartment moving",
    description:
      "Need 2-3 people to help move from a 2-bedroom apartment. Heavy furniture included. Truck provided.",
    category: "Moving Help",
    budget: 35,
    budgetType: "hourly",
    location: "Brooklyn, NY",
    isRemote: false,
    customerName: "Mike Wilson",
    customerId: "customer_3",
    customerRating: 4.6,
    customerVerified: false,
    postedAt: "2024-01-14T09:45:00Z",
    deadline: "2024-01-16T18:00:00Z",
    urgency: "high",
    skillsRequired: ["Moving", "Physical Labor"],
    bidsCount: 8,
    viewsCount: 43,
    images: [],
    timeEstimate: "4-6 hours",
    status: "open",
  },
  {
    id: "4",
    title: "Website maintenance and updates",
    description:
      "Need a developer to update my business website with new content and fix some layout issues. WordPress site needs responsive design improvements.",
    category: "Digital Services",
    budget: 150,
    budgetType: "fixed",
    location: "Remote",
    isRemote: true,
    customerName: "Emma Davis",
    customerId: "customer_4",
    customerRating: 4.7,
    customerVerified: true,
    postedAt: "2024-01-13T16:20:00Z",
    deadline: "2024-01-20T17:00:00Z",
    urgency: "medium",
    skillsRequired: ["WordPress", "HTML", "CSS", "Responsive Design"],
    bidsCount: 6,
    viewsCount: 89,
    images: [],
    timeEstimate: "1-2 days",
    status: "bid_accepted",
    instructions: "Please backup the site before making changes.",
    assignedTaskerId: "demo-tasker",
    assignedTaskerName: "John Smith",
    acceptedBidId: "bid_demo_1",
  },
  {
    id: "5",
    title: "House cleaning service needed",
    description:
      "Looking for professional house cleaning service for a 3-bedroom apartment. Deep cleaning required including kitchen and bathrooms.",
    category: "Cleaning",
    budget: 120,
    budgetType: "fixed",
    location: "Brooklyn, NY",
    isRemote: false,
    customerName: "Jennifer Wilson",
    customerId: "customer_5",
    customerRating: 4.6,
    customerVerified: true,
    postedAt: "2024-01-16T08:00:00Z",
    deadline: "2024-01-19T12:00:00Z",
    urgency: "medium",
    skillsRequired: ["Cleaning", "Housekeeping"],
    bidsCount: 4,
    viewsCount: 32,
    images: [],
    timeEstimate: "4-5 hours",
    status: "open",
    instructions: "Please bring your own cleaning supplies.",
  },
  {
    id: "6",
    title: "Garden landscaping project",
    description:
      "Need help with garden landscaping including planting new flowers, trimming bushes, and general garden maintenance.",
    category: "Home Repair",
    budget: 200,
    budgetType: "fixed",
    location: "Queens, NY",
    isRemote: false,
    customerName: "Robert Chen",
    customerId: "customer_6",
    customerRating: 4.9,
    customerVerified: true,
    postedAt: "2024-01-16T14:30:00Z",
    urgency: "low",
    skillsRequired: ["Gardening", "Landscaping", "Outdoor Work"],
    bidsCount: 7,
    viewsCount: 45,
    images: [],
    timeEstimate: "6-8 hours",
    status: "open",
  },
  {
    id: "7",
    title: "Furniture assembly assistance",
    description:
      "Need help assembling IKEA furniture including a wardrobe, desk, and bookshelf. All tools and instructions provided.",
    category: "Home Repair",
    budget: 80,
    budgetType: "fixed",
    location: "Manhattan, NY",
    isRemote: false,
    customerName: "Lisa Martinez",
    customerId: "customer_7",
    customerRating: 4.5,
    customerVerified: false,
    postedAt: "2024-01-17T09:15:00Z",
    urgency: "medium",
    skillsRequired: ["Assembly", "Tools", "Furniture"],
    bidsCount: 2,
    viewsCount: 18,
    images: [],
    timeEstimate: "3-4 hours",
    status: "open",
    instructions: "Weekend work preferred.",
  },
  {
    id: "8",
    title: "Math tutoring for high school student",
    description:
      "Looking for an experienced math tutor to help my daughter with Algebra 2 and Calculus preparation. Need someone patient and good at explaining concepts.",
    category: "Tutoring",
    budget: 45,
    budgetType: "hourly",
    location: "Queens, NY",
    isRemote: false,
    customerName: "Patricia Lee",
    customerId: "customer_8",
    customerRating: 4.8,
    customerVerified: true,
    postedAt: "2024-01-17T10:30:00Z",
    urgency: "medium",
    skillsRequired: ["Mathematics", "Teaching", "Tutoring", "High School"],
    bidsCount: 6,
    viewsCount: 28,
    images: [],
    timeEstimate: "2 hours per session",
    status: "open",
    instructions: "Prefer sessions twice a week, flexible timing.",
  },
];

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
  {
    id: "bid_4",
    taskId: "2",
    bidderId: "tasker_4",
    bidderName: "Sarah Designer",
    bidderRating: 4.8,
    bidderCompletedTasks: 156,
    amount: 220,
    message:
      "I'm a professional logo designer with 8+ years of experience. I'll provide multiple concepts and unlimited revisions.",
    deliveryTime: "3-5 days",
    submittedAt: "2024-01-14T16:20:00Z",
    bidderVerified: true,
    bidderResponse: "under 1 hour",
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [bids, setBids] = useState<Bid[]>(defaultBids);

  const addTask = (
    taskData: Omit<
      Task,
      "id" | "postedAt" | "bidsCount" | "viewsCount" | "status"
    >,
  ) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      postedAt: new Date().toISOString(),
      bidsCount: 0,
      viewsCount: 0,
      status: "open",
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  const getTasksByUser = (userId: string) => {
    return tasks.filter((task) => task.customerId === userId);
  };

  const getAllTasks = () => {
    return tasks;
  };

  const acceptBid = (
    taskId: string,
    bidId: string,
    taskerId: string,
    taskerName: string,
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "bid_accepted" as const,
              assignedTaskerId: taskerId,
              assignedTaskerName: taskerName,
              acceptedBidId: bidId,
            }
          : task,
      ),
    );
  };

  const approveTaskAndHoldEscrow = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "approved" as const,
              customerApproval: true,
              escrowAmount: task.budget,
              escrowStatus: "held" as const,
              adminCommission: Math.round(task.budget * 0.1), // 10% commission
              taskerPayment: Math.round(task.budget * 0.9), // 90% to tasker
            }
          : task,
      ),
    );
  };

  const markTaskCompleted = (
    taskId: string,
    userId: string,
    userRole: "customer" | "tasker",
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updates: Partial<Task> = {};

          if (userRole === "customer") {
            updates.customerCompleted = true;
          } else {
            updates.taskerCompleted = true;
          }

          // If both have marked as completed, change status and set completion date
          const bothCompleted =
            (userRole === "customer" ? true : task.customerCompleted) &&
            (userRole === "tasker" ? true : task.taskerCompleted);

          if (bothCompleted) {
            updates.status = "completed" as const;
            updates.completedAt = new Date().toISOString();
          } else {
            updates.status = "in_progress" as const;
          }

          return { ...task, ...updates };
        }
        return task;
      }),
    );
  };

  const releasePayment = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId && task.status === "completed"
          ? {
              ...task,
              escrowStatus: "released" as const,
              paymentReleased: true,
            }
          : task,
      ),
    );
  };

  const getTasksByTasker = (taskerId: string) => {
    return tasks.filter((task) => task.assignedTaskerId === taskerId);
  };

  const placeBid = (
    taskId: string,
    bidData: Omit<Bid, "id" | "taskId" | "submittedAt">,
  ) => {
    const newBid: Bid = {
      ...bidData,
      id: `bid_${Date.now()}`,
      taskId: taskId,
      submittedAt: new Date().toISOString(),
    };

    setBids((prev) => [newBid, ...prev]);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              bidsCount: task.bidsCount + 1,
            }
          : task,
      ),
    );
  };

  const getBidsForTask = (taskId: string) => {
    return bids.filter((bid) => bid.taskId === taskId);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        bids,
        addTask,
        updateTask,
        getTasksByUser,
        getAllTasks,
        acceptBid,
        getTasksByTasker,
        approveTaskAndHoldEscrow,
        markTaskCompleted,
        releasePayment,
        placeBid,
        getBidsForTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
