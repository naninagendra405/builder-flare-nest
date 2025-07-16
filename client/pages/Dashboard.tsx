import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import NotificationDropdown from "../components/NotificationDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  // Extract first name for nickname display (limit to 7-8 chars)
  const getUserNickname = (fullName: string) => {
    const firstName = fullName.split(" ")[0];
    return firstName.length > 8 ? firstName.substring(0, 7) : firstName;
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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Enhanced Desktop/Mobile Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Welcome */}
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    <span className="hidden sm:inline">Welcome back, </span>
                    {getUserNickname(user.name)}!
                  </h1>
                  <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user.role} Dashboard
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                <Link
                  to="/tasks"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  <Search className="w-4 h-4" />
                  <span className="font-medium">Browse</span>
                </Link>

                <Link
                  to="/wallet"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="font-medium">Wallet</span>
                </Link>

                <Link
                  to="/chat"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-400 dark:hover:text-purple-400 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">Messages</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-400 dark:hover:text-orange-400 dark:hover:bg-orange-900/20 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Profile</span>
                </Link>
              </div>

              {/* Mobile/Desktop Actions */}
              <div className="flex items-center space-x-2 lg:space-x-3">
                {user.role === "customer" && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs lg:text-sm px-3 lg:px-4 shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link to="/create-task">
                      <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
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
                      className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                      <Avatar className="h-9 w-9 lg:h-10 lg:w-10 ring-2 ring-blue-100 dark:ring-blue-900 hover:ring-blue-200 dark:hover:ring-blue-800 transition-all duration-200">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm lg:text-base font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-60 lg:w-64 shadow-lg border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
                    align="end"
                    forceMount
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm lg:text-base">
                        {user.name}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 capitalize mt-1">
                        {user.role} Account
                      </p>
                    </div>

                    {/* Mobile Navigation in Dropdown */}
                    <div className="lg:hidden py-2">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/tasks"
                          className="cursor-pointer py-3 px-4 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Search className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium">Browse Tasks</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/wallet"
                          className="cursor-pointer py-3 px-4 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <Wallet className="w-4 h-4 mr-3 text-green-600 dark:text-green-400" />
                          <span className="font-medium">Wallet</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/chat"
                          className="cursor-pointer py-3 px-4 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          <MessageSquare className="w-4 h-4 mr-3 text-purple-600 dark:text-purple-400" />
                          <span className="font-medium">Messages</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/profile"
                          className="cursor-pointer py-3 px-4 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        >
                          <User className="w-4 h-4 mr-3 text-orange-600 dark:text-orange-400" />
                          <span className="font-medium">Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                    </div>

                    <div className="py-2">
                      <DropdownMenuItem className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Settings className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium">Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="py-3 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span className="font-medium">Sign out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-4 lg:py-6 space-y-6">
          {/* Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-3 lg:p-6">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon
                          className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color} group-hover:animate-pulse`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                          {stat.label}
                        </p>
                        <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
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

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Recent Tasks */}
            <Card className="bg-white dark:bg-gray-900 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 lg:pb-4">
                <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                  {user.role === "customer" ? "Your Tasks" : "Recent Work"}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/tasks"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <Tooltip key={task.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center justify-between p-3 lg:p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer group hover:shadow-md"
                          onClick={() => navigate(`/task/${task.id}`)}
                        >
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-medium text-sm lg:text-base text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors truncate">
                              {task.title}
                            </h4>
                            <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="truncate max-w-20 lg:max-w-none">
                                  {task.location}
                                </span>
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {task.time}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className="text-right">
                              <p className="font-semibold text-sm lg:text-base text-blue-600 dark:text-blue-400">
                                {task.budget}
                              </p>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getStatusColor(task.status)}`}
                              >
                                {task.status}
                              </Badge>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          Location: {task.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          Posted: {task.time}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))
                ) : (
                  <div className="text-center py-6 lg:py-8">
                    <Briefcase className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-3 lg:mb-4" />
                    <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 mb-3 lg:mb-4">
                      {user.role === "customer"
                        ? "No tasks posted yet"
                        : "No tasks completed yet"}
                    </p>
                    <Button size="sm" asChild>
                      <Link
                        to={
                          user.role === "customer" ? "/create-task" : "/tasks"
                        }
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 lg:pb-4">
                <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                  {user.role === "customer"
                    ? "Popular Tasks"
                    : "Available Tasks"}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/tasks"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {availableTasks.map((task) => (
                  <Tooltip key={task.id}>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center justify-between p-3 lg:p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 cursor-pointer group hover:shadow-md"
                        onClick={() => navigate(`/task/${task.id}`)}
                      >
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-medium text-sm lg:text-base text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-20 lg:max-w-none">
                                {task.location}
                              </span>
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {task.bids} bids
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <div className="text-right">
                            <p className="font-semibold text-sm lg:text-base text-green-600 dark:text-green-400">
                              {task.budget}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {task.time}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">
                        Location: {task.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        Budget: {task.budget}
                      </p>
                      <p className="text-sm text-gray-600">
                        {task.bids} people have bid on this task
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-4 lg:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h3 className="text-lg lg:text-xl font-bold mb-2">
                    {user.role === "customer"
                      ? "Need something done?"
                      : "Ready to earn more?"}
                  </h3>
                  <p className="text-sm lg:text-base text-blue-100">
                    {user.role === "customer"
                      ? "Post a task and get it done by skilled professionals in your area."
                      : "Browse available tasks and start earning money today."}
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-sm lg:text-base px-4 lg:px-6"
                  asChild
                >
                  <Link
                    to={user.role === "customer" ? "/create-task" : "/tasks"}
                  >
                    {user.role === "customer" ? "Post a Task" : "Browse Tasks"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
