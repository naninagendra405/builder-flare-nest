import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import NotificationDropdown from "../components/NotificationDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Settings,
  User,
  LogOut,
  Wallet,
  MessageSquare,
  Clock,
  CheckCircle,
  IndianRupee,
  TrendingUp,
  MapPin,
  Star,
  Zap,
  ArrowRight,
  Calendar,
  Activity,
  Target,
  Award,
  Briefcase,
  Users,
  Eye,
  ChevronRight,
  Filter,
  Bell,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { getTasksByUser, getAllTasks } = useTasks();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userTasks = getTasksByUser(user.id);
  const allTasks = getAllTasks();

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const recentTasks = userTasks.slice(0, 3).map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    budget: `₹${task.budget}`,
    location: task.location,
    time: getTimeAgo(task.postedAt),
    customer: task.customerName,
  }));

  const availableTasks = allTasks.slice(0, 3).map((task) => ({
    id: task.id,
    title: task.title,
    budget: `₹${task.budget}`,
    location: task.location,
    time: getTimeAgo(task.postedAt),
    bids: task.bidsCount,
  }));

  const customerStats = [
    {
      label: "Active Tasks",
      value: "3",
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      change: "+2 this week",
    },
    {
      label: "Completed",
      value: "12",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
      change: "+4 this month",
    },
    {
      label: "Total Spent",
      value: "₹15,240",
      icon: IndianRupee,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      change: "+₹2,400 this month",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      change: "95% satisfaction",
    },
  ];

  const taskerStats = [
    {
      label: "Tasks Done",
      value: "24",
      icon: Target,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      change: "+6 this month",
    },
    {
      label: "Earnings",
      value: "₹28,450",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
      change: "+₹5,200 this month",
    },
    {
      label: "Rating",
      value: "4.9",
      icon: Award,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      change: "98% satisfaction",
    },
    {
      label: "Response Time",
      value: "< 2h",
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      change: "Faster than 85%",
    },
  ];

  const stats = user.role === "customer" ? customerStats : taskerStats;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Enhanced Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Welcome */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {user.role} Dashboard
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
                asChild
              >
                <Link to="/tasks">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Tasks
                </Link>
              </Button>

              {user.role === "customer" && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  asChild
                >
                  <Link to="/create-task">
                    <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Post Task</span>
                    <span className="sm:hidden">Post</span>
                  </Link>
                </Button>
              )}

              <NotificationDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wallet" className="cursor-pointer">
                      <Wallet className="w-4 h-4 mr-2" />
                      Wallet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/chat" className="cursor-pointer">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        className={`w-6 h-6 ${stat.color} group-hover:animate-pulse`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            asChild
          >
            <Link to="/tasks">
              <Search className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
              <span className="text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                Browse
              </span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-200 dark:hover:border-green-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            asChild
          >
            <Link to="/wallet">
              <Wallet className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
              <span className="text-sm font-medium group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                Wallet
              </span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            asChild
          >
            <Link to="/chat">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
              <span className="text-sm font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                Messages
              </span>
            </Link>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2 bg-white dark:bg-gray-900 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:border-orange-200 dark:hover:border-orange-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            asChild
          >
            <Link to="/profile">
              <User className="w-6 h-6 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors" />
              <span className="text-sm font-medium group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                Profile
              </span>
            </Link>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.role === "customer" ? "Your Tasks" : "Recent Work"}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tasks" className="text-blue-600 hover:text-blue-700">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer group hover:shadow-md"
                    onClick={() => navigate(`/task/${task.id}`)}
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {task.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                          {task.budget}
                        </p>
                        <Badge
                          variant="outline"
                          className={getStatusColor(task.status)}
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {user.role === "customer"
                      ? "No tasks posted yet"
                      : "No tasks completed yet"}
                  </p>
                  <Button size="sm" asChild>
                    <Link
                      to={user.role === "customer" ? "/create-task" : "/tasks"}
                    >
                      {user.role === "customer"
                        ? "Post Your First Task"
                        : "Find Tasks"}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Tasks / Task Feed */}
          <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.role === "customer" ? "Popular Tasks" : "Available Tasks"}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tasks" className="text-blue-600 hover:text-blue-700">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 cursor-pointer group hover:shadow-md"
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors truncate">
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {task.location}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {task.bids} bids
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {task.budget}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.time}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">
                  {user.role === "customer"
                    ? "Need something done?"
                    : "Ready to earn more?"}
                </h3>
                <p className="text-blue-100">
                  {user.role === "customer"
                    ? "Post a task and get it done by skilled professionals in your area."
                    : "Browse available tasks and start earning money today."}
                </p>
              </div>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                asChild
              >
                <Link to={user.role === "customer" ? "/create-task" : "/tasks"}>
                  {user.role === "customer" ? "Post a Task" : "Browse Tasks"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
