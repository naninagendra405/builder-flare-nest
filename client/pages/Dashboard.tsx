import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import NotificationDropdown from "../components/NotificationDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  const customerStats = [
    { label: "Active Tasks", value: "3", icon: Clock, color: "text-blue-600" },
    {
      label: "Completed",
      value: "12",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Total Spent",
      value: "₹1,03,968",
      icon: IndianRupee,
      color: "text-purple-600",
    },
    { label: "Avg Rating", value: "4.9", icon: Star, color: "text-yellow-600" },
  ];

  const taskerStats = [
    {
      label: "Available Tasks",
      value: "24",
      icon: Search,
      color: "text-blue-600",
    },
    {
      label: "Completed",
      value: "47",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Total Earned",
      value: "₹2,88,074",
      icon: IndianRupee,
      color: "text-purple-600",
    },
    {
      label: "Success Rate",
      value: "98%",
      icon: TrendingUp,
      color: "text-green-600",
    },
  ];

  // Get user's tasks if customer, or available tasks if tasker
  const userTasks =
    user.role === "customer" ? getTasksByUser(user.id || "") : [];
  const allTasks = getAllTasks();

  // Format tasks for display
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

  function getTimeAgo(dateString: string) {
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
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = user.role === "customer" ? customerStats : taskerStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">TaskIt</span>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wallet">
                      <Wallet className="w-4 h-4 mr-2" />
                      Wallet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {user.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {user.role === "customer"
                ? "Manage your tasks and find great taskers"
                : "Find new opportunities and grow your business"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {user.role === "customer" ? (
              <Button asChild className="w-full sm:w-auto">
                <Link to="/create-task">
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Task
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full sm:w-auto">
                <Link to="/tasks">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Tasks
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Link>
            </Button>
          </div>
        </div>

        {/* Verification Status Alert for Taskers */}
        {user.role === "tasker" && user.verificationStatus === "pending" && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                    Verification in Progress
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                    We're reviewing your professional credentials and documents.
                    This usually takes 24-48 hours.
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/profile">View Verification Status</Link>
                    </Button>
                    {user.taskerProfile?.professionalCredentials?.length ===
                      0 && (
                      <Button variant="outline" size="sm">
                        <Link
                          to="/add-credentials"
                          className="flex items-center"
                        >
                          Add More Credentials
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === "tasker" && user.verificationStatus === "verified" && (
          <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    🎉 You're Verified!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                    Your professional credentials have been verified. You now
                    get priority placement in search results and higher customer
                    trust.
                  </p>
                  {user.taskerProfile && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="default" className="bg-green-600">
                        ✓ Professional Verified
                      </Badge>
                      <Badge variant="outline">
                        Trust Score:{" "}
                        {user.taskerProfile.professionalCredentials?.filter(
                          (c) => c.verified,
                        ).length *
                          20 +
                          60}
                        %
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent/Current Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>
                {user.role === "customer" ? "Your Tasks" : "Current Tasks"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer space-y-3 sm:space-y-0"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {task.location}
                      </span>
                      <span>{task.time}</span>
                    </div>
                    {user.role === "customer" && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Tasker: {task.customer}
                      </p>
                    )}
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-right">
                    <div className="text-lg font-semibold text-primary">
                      {task.budget}
                    </div>
                    <Badge
                      className={`mt-0 sm:mt-2 ${getStatusColor(task.status)}`}
                      variant="secondary"
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to={user.role === "customer" ? "/tasks" : "/tasks"}>
                  View All Tasks
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Available Tasks (for taskers) or Quick Actions (for customers) */}
          <Card>
            <CardHeader>
              <CardTitle>
                {user.role === "customer"
                  ? "Recommended Tasks"
                  : "Available Tasks"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {task.location}
                      </span>
                      <span>{task.time}</span>
                    </div>
                    {user.role === "tasker" && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.bids} bids
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary">
                      {task.budget}
                    </div>
                    <Button size="sm" className="mt-2">
                      {user.role === "customer" ? "View" : "Bid Now"}
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/tasks">
                  {user.role === "customer"
                    ? "Browse All Tasks"
                    : "See More Tasks"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
