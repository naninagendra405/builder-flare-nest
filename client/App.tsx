import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import TaskFeed from "./pages/TaskFeed";
import TaskDetail from "./pages/TaskDetail";
import Chat from "./pages/Chat";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import AddCredentials from "./pages/AddCredentials";
import TaskSuggestionsPage from "./pages/TaskSuggestionsPage";
import MyAssignedTasks from "./pages/MyAssignedTasks";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { TaskProvider } from "./contexts/TaskContext";
import AIChatSupport from "./components/AIChatSupport";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <NotificationProvider>
          <TaskProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/tasks" element={<TaskFeed />} />
                <Route
                  path="/my-assigned-tasks"
                  element={<MyAssignedTasks />}
                />
                <Route path="/task/:id" element={<TaskDetail />} />
                <Route path="/chat/:chatId?" element={<Chat />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-credentials" element={<AddCredentials />} />
                <Route
                  path="/task-suggestions"
                  element={<TaskSuggestionsPage />}
                />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <AIChatSupport />
            </BrowserRouter>
          </TaskProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
