import React, { createContext, useContext, useState } from "react";

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
  status: "open" | "in_progress" | "completed" | "cancelled";
  instructions?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (
    task: Omit<Task, "id" | "postedAt" | "bidsCount" | "viewsCount" | "status">,
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  getTasksByUser: (userId: string) => Task[];
  getAllTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Realistic everyday tasks for TaskIt
const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Book annual health checkup appointment",
    description:
      "Schedule comprehensive health screening with family doctor including blood tests and physical examination",
    category: "Health & Wellness",
    budget: 150,
    budgetType: "fixed",
    location: "Local clinic/hospital",
    isRemote: false,
    customerName: "Priya Sharma",
    customerId: "customer_1",
    customerRating: 4.8,
    customerVerified: true,
    postedAt: "2024-01-15T10:30:00Z",
    deadline: "2024-02-15T17:00:00Z",
    urgency: "medium",
    skillsRequired: ["Healthcare", "Appointment Booking", "Medical"],
    bidsCount: 5,
    viewsCount: 23,
    images: [],
    timeEstimate: "30 minutes",
    status: "open",
    instructions: "Prefer morning appointments between 9-11 AM",
  },
  {
    id: "2",
    title: "Fix leaking kitchen tap urgently",
    description:
      "Kitchen tap has been leaking for 2 days, need immediate plumbing repair to prevent water damage",
    category: "Home Services",
    budget: 600,
    budgetType: "fixed",
    location: "Bandra, Mumbai",
    isRemote: false,
    customerName: "Rajesh Kumar",
    customerId: "customer_2",
    customerRating: 4.9,
    customerVerified: true,
    postedAt: "2024-01-16T08:15:00Z",
    deadline: "2024-01-18T20:00:00Z",
    urgency: "high",
    skillsRequired: ["Plumbing", "Repair", "Emergency"],
    bidsCount: 12,
    viewsCount: 45,
    images: [],
    timeEstimate: "1-2 hours",
    status: "open",
    instructions: "Have all basic tools. Building has parking available.",
  },
  {
    id: "3",
    title: "Find and hire a family lawyer",
    description:
      "Research and consult with experienced family lawyers for child custody case proceedings",
    category: "Legal & Documentation",
    budget: 2500,
    budgetType: "fixed",
    location: "Delhi NCR",
    isRemote: true,
    customerName: "Anita Gupta",
    customerId: "customer_3",
    customerRating: 4.6,
    customerVerified: true,
    postedAt: "2024-01-14T16:45:00Z",
    deadline: "2024-01-25T18:00:00Z",
    urgency: "high",
    skillsRequired: ["Legal Research", "Family Law", "Consultation"],
    bidsCount: 8,
    viewsCount: 67,
    images: [],
    timeEstimate: "3-5 hours research + consultation",
    status: "open",
    instructions:
      "Need lawyer with experience in custody cases. Video consultation preferred.",
  },
  {
    id: "4",
    title: "Deep cleaning service for 3BHK apartment",
    description:
      "Professional deep cleaning including bathrooms, kitchen, bedrooms, and balcony before guests arrive",
    category: "Home Services",
    budget: 2000,
    budgetType: "fixed",
    location: "Whitefield, Bangalore",
    isRemote: false,
    customerName: "Suresh Reddy",
    customerId: "customer_4",
    customerRating: 4.7,
    customerVerified: true,
    postedAt: "2024-01-15T12:20:00Z",
    deadline: "2024-01-22T10:00:00Z",
    urgency: "medium",
    skillsRequired: ["Deep Cleaning", "Professional Service", "Sanitization"],
    bidsCount: 15,
    viewsCount: 89,
    images: [],
    timeEstimate: "6-8 hours",
    status: "open",
    instructions:
      "Bring all cleaning supplies. Important guests arriving next week.",
  },
  {
    id: "5",
    title: "Hire a driver for airport pickup",
    description:
      "Reliable driver needed for early morning airport pickup at 5 AM with large luggage",
    category: "Transport & Drivers",
    budget: 800,
    budgetType: "fixed",
    location: "Andheri to Mumbai Airport",
    isRemote: false,
    customerName: "Kavya Singh",
    customerId: "customer_5",
    customerRating: 4.8,
    customerVerified: true,
    postedAt: "2024-01-16T19:30:00Z",
    deadline: "2024-01-28T05:00:00Z",
    urgency: "medium",
    skillsRequired: ["Driving", "Punctuality", "Airport Knowledge"],
    bidsCount: 7,
    viewsCount: 34,
    images: [],
    timeEstimate: "2 hours",
    status: "open",
    instructions:
      "Must be punctual for 5 AM pickup. Have space for 3 large suitcases.",
  },
  {
    id: "6",
    title: "Book babysitter for weekend dinner",
    description:
      "Trusted babysitter needed for 2 children (ages 5 and 8) for Saturday evening dinner outing",
    category: "Family & Personal Life",
    budget: 200,
    budgetType: "hourly",
    location: "Koramangala, Bangalore",
    isRemote: false,
    customerName: "Neha Agarwal",
    customerId: "customer_6",
    customerRating: 4.9,
    customerVerified: true,
    postedAt: "2024-01-15T14:00:00Z",
    deadline: "2024-01-27T18:00:00Z",
    urgency: "low",
    skillsRequired: ["Childcare", "Trustworthy", "Experience with Kids"],
    bidsCount: 9,
    viewsCount: 56,
    images: [],
    timeEstimate: "4 hours",
    status: "open",
    instructions:
      "Children are well-behaved. Experience with kids 5-10 years preferred.",
  },
  {
    id: "7",
    title: "Apply for tourist visa for Europe trip",
    description:
      "Complete visa application process including document preparation, appointment booking, and submission",
    category: "Travel & Planning",
    budget: 8000,
    budgetType: "fixed",
    location: "Visa center + online",
    isRemote: false,
    customerName: "Vikram Malhotra",
    customerId: "customer_7",
    customerRating: 4.5,
    customerVerified: true,
    postedAt: "2024-01-14T11:15:00Z",
    deadline: "2024-02-05T17:00:00Z",
    urgency: "high",
    skillsRequired: [
      "Visa Processing",
      "Document Preparation",
      "Travel Planning",
    ],
    bidsCount: 6,
    viewsCount: 78,
    images: [],
    timeEstimate: "2-3 days process",
    status: "open",
    instructions: "Need help with Schengen visa. Have passport ready.",
  },
  {
    id: "8",
    title: "Install new air conditioner in bedroom",
    description:
      "Professional installation of 1.5 ton split AC with electrical connections and wall mounting",
    category: "Home Services",
    budget: 3000,
    budgetType: "fixed",
    location: "Gurgaon, Haryana",
    isRemote: false,
    customerName: "Rohit Verma",
    customerId: "customer_8",
    customerRating: 4.6,
    customerVerified: false,
    postedAt: "2024-01-13T15:45:00Z",
    deadline: "2024-02-20T18:00:00Z",
    urgency: "low",
    skillsRequired: ["AC Installation", "Electrical Work", "Wall Mounting"],
    bidsCount: 11,
    viewsCount: 67,
    images: [],
    timeEstimate: "4-5 hours",
    status: "open",
    instructions:
      "AC unit already purchased. Need installation and electrical setup.",
  },
  {
    id: "9",
    title: "Create business presentation for investor meeting",
    description:
      "Design professional PowerPoint presentation for startup pitch to potential investors",
    category: "Digital Services",
    budget: 8000,
    budgetType: "fixed",
    location: "Remote work",
    isRemote: true,
    customerName: "Startup Ventures Inc.",
    customerId: "customer_9",
    customerRating: 4.8,
    customerVerified: true,
    postedAt: "2024-01-16T09:30:00Z",
    deadline: "2024-01-24T12:00:00Z",
    urgency: "high",
    skillsRequired: [
      "PowerPoint Design",
      "Business Presentations",
      "Graphic Design",
    ],
    bidsCount: 18,
    viewsCount: 134,
    images: [],
    timeEstimate: "2-3 days",
    status: "open",
    instructions:
      "Need professional design with company branding. Content will be provided.",
  },
  {
    id: "10",
    title: "Find tutor for child's math preparation",
    description:
      "Experienced math tutor needed for 10th grade student preparing for board exams",
    category: "Education & Training",
    budget: 800,
    budgetType: "hourly",
    location: "Pune, Maharashtra",
    isRemote: true,
    customerName: "Sunita Joshi",
    customerId: "customer_10",
    customerRating: 4.7,
    customerVerified: true,
    postedAt: "2024-01-15T17:20:00Z",
    deadline: "2024-01-25T19:00:00Z",
    urgency: "high",
    skillsRequired: [
      "Mathematics Teaching",
      "Board Exam Prep",
      "10th Grade Curriculum",
    ],
    bidsCount: 14,
    viewsCount: 92,
    images: [],
    timeEstimate: "2 hours daily",
    status: "open",
    instructions:
      "Need help with CBSE syllabus. Online or home tutoring both acceptable.",
  },
  {
    id: "11",
    title: "Pest control treatment for entire house",
    description:
      "Professional pest control service to eliminate cockroaches and ants throughout the house",
    category: "Home Services",
    budget: 1500,
    budgetType: "fixed",
    location: "Entire house, Noida",
    isRemote: false,
    customerName: "Amit Chandra",
    customerId: "customer_11",
    customerRating: 4.4,
    customerVerified: true,
    postedAt: "2024-01-14T13:10:00Z",
    deadline: "2024-01-26T16:00:00Z",
    urgency: "medium",
    skillsRequired: ["Pest Control", "Extermination", "Chemical Treatment"],
    bidsCount: 8,
    viewsCount: 45,
    images: [],
    timeEstimate: "3-4 hours",
    status: "open",
    instructions:
      "3BHK apartment. Cockroach problem in kitchen and ants in living room.",
  },
  {
    id: "12",
    title: "Book hotel accommodation for business trip",
    description:
      "Reserve 3-day hotel stay in Mumbai for business conference with breakfast included",
    category: "Travel & Planning",
    budget: 12000,
    budgetType: "fixed",
    location: "Mumbai hotel",
    isRemote: true,
    customerName: "Corporate Solutions Ltd.",
    customerId: "customer_12",
    customerRating: 4.9,
    customerVerified: true,
    postedAt: "2024-01-15T11:45:00Z",
    deadline: "2024-02-01T15:00:00Z",
    urgency: "medium",
    skillsRequired: ["Hotel Booking", "Travel Planning", "Business Travel"],
    bidsCount: 5,
    viewsCount: 67,
    images: [],
    timeEstimate: "1 hour booking",
    status: "open",
    instructions:
      "Need hotel near BKC area. Business conference from Feb 15-17.",
  },
  {
    id: "13",
    title: "Dental cleaning and checkup appointment",
    description:
      "Routine dental cleaning and oral health examination with scaling if required",
    category: "Health & Wellness",
    budget: 2000,
    budgetType: "fixed",
    location: "Dental clinic, Chennai",
    isRemote: false,
    customerName: "Lakshmi Nair",
    customerId: "customer_13",
    customerRating: 4.6,
    customerVerified: true,
    postedAt: "2024-01-16T10:15:00Z",
    deadline: "2024-02-08T18:00:00Z",
    urgency: "low",
    skillsRequired: ["Dental Care", "Appointment Booking", "Oral Health"],
    bidsCount: 4,
    viewsCount: 28,
    images: [],
    timeEstimate: "1.5 hours",
    status: "open",
    instructions: "Prefer clinic in T. Nagar area. Need scaling and polishing.",
  },
  {
    id: "14",
    title: "Arrange birthday party for child",
    description:
      "Organize complete birthday party setup for 8-year-old including decorations, cake, and entertainment",
    category: "Events & Celebrations",
    budget: 15000,
    budgetType: "fixed",
    location: "Home party hall, Hyderabad",
    isRemote: false,
    customerName: "Arjun Reddy",
    customerId: "customer_14",
    customerRating: 4.8,
    customerVerified: true,
    postedAt: "2024-01-14T16:30:00Z",
    deadline: "2024-02-18T14:00:00Z",
    urgency: "low",
    skillsRequired: [
      "Event Planning",
      "Party Decoration",
      "Child Entertainment",
    ],
    bidsCount: 12,
    viewsCount: 156,
    images: [],
    timeEstimate: "Full day setup",
    status: "open",
    instructions:
      "Superhero theme party. Need decorations, games, and birthday cake.",
  },
  {
    id: "15",
    title: "Hire monthly cook for home meals",
    description:
      "Find experienced cook for preparing daily lunch and dinner with North Indian cuisine expertise",
    category: "Home Services",
    budget: 2000,
    budgetType: "hourly",
    location: "Home kitchen, Kolkata",
    isRemote: false,
    customerName: "Ritu Das",
    customerId: "customer_15",
    customerRating: 4.7,
    customerVerified: true,
    postedAt: "2024-01-15T18:45:00Z",
    deadline: "2024-01-30T19:00:00Z",
    urgency: "medium",
    skillsRequired: ["Cooking", "North Indian Cuisine", "Home Cooking"],
    bidsCount: 19,
    viewsCount: 234,
    images: [],
    timeEstimate: "4 hours daily",
    status: "open",
    instructions: "Need cook for family of 4. Vegetarian meals preferred.",
  },
];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        getTasksByUser,
        getAllTasks,
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
