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
  cancelTask: (id: string, userId: string) => boolean;
  getTasksByUser: (userId: string) => Task[];
  getAllTasks: () => Task[];
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
    category: "Emergency Help",
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

  const cancelTask = (id: string, userId: string): boolean => {
    const task = tasks.find((t) => t.id === id);

    // Check if task exists and belongs to the user
    if (!task || task.customerId !== userId) {
      return false;
    }

    // Check if task can be cancelled (only open tasks with no bids)
    if (task.status !== "open" || task.bidsCount > 0) {
      return false;
    }

    // Cancel the task
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "cancelled" as const } : task,
      ),
    );

    return true;
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
        cancelTask,
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
