import { useAuth } from "../contexts/AuthContext";
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
  DollarSign,
  TrendingUp,
  MapPin,
  Star,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
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
      value: "$1,248",
      icon: DollarSign,
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
      value: "$3,456",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      label: "Success Rate",
      value: "98%",
      icon: TrendingUp,
      color: "text-green-600",
    },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Fix kitchen sink leak",
      status: "in_progress",
      budget: "$75",
      location: "Manhattan, NY",
      time: "2 hours ago",
      customer: "Sarah M.",
    },
    {
      id: 2,
      title: "Logo design for startup",
      status: "pending",
      budget: "$250",
      location: "Remote",
      time: "1 day ago",
      customer: "TechCorp Inc.",
    },
    {
      id: 3,
      title: "Help with moving",
      status: "completed",
      budget: "$120",
      location: "Brooklyn, NY",
      time: "3 days ago",
      customer: "Mike R.",
    },
  ];

  const availableTasks = [
    {
      id: 4,
      title: "Assembly IKEA furniture",
      budget: "$60",
      location: "Queens, NY",
      time: "30 min ago",
      bids: 5,
    },
    {
      id: 5,
      title: "Website bug fixes",
      budget: "$150",
      location: "Remote",
      time: "1 hour ago",
      bids: 8,
    },
    {
      id: 6,
      title: "Garden cleanup",
      budget: "$80",
      location: "Staten Island, NY",
      time: "2 hours ago",
      bids: 3,
    },
  ];

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
