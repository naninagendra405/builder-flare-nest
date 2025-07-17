import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Calendar,
  Search,
  Filter,
  SortAsc,
  CheckCircle,
  Timer,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import type { Task } from "../contexts/TaskContext";

export default function MyAssignedTasks() {
  const { user } = useAuth();
  const { getTasksByTasker } = useTasks();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  if (!user || user.role !== "tasker") {
    navigate("/dashboard");
    return null;
  }

  const assignedTasks = getTasksByTasker(user.id || "");

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = assignedTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
          );
        case "budget-high":
          return b.budget - a.budget;
        case "budget-low":
          return a.budget - b.budget;
        case "deadline":
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [assignedTasks, searchQuery, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "bid_accepted":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "bid_accepted":
        return "Awaiting Approval";
      case "approved":
        return "Approved - Start Work";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status.replace("_", " ");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in_progress":
        return <Timer className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "bid_accepted":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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

  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "bid_accepted", label: "Awaiting Approval" },
    { value: "approved", label: "Approved" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "budget-high", label: "Highest Budget" },
    { value: "budget-low", label: "Lowest Budget" },
    { value: "deadline", label: "Earliest Deadline" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fb7fcb38896684c25a67a71f6b5b0365e%2F81896caa38e7430aac41e48cb8db0102?format=webp&width=800"
                  alt="TaskIt Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate("/tasks")}>
                Browse Available Tasks
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              My Assigned Tasks
            </h1>
            <p className="text-muted-foreground">
              All tasks assigned to you ({filteredAndSortedTasks.length} tasks)
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your assigned tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task List */}
        {filteredAndSortedTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {assignedTasks.length === 0
                  ? "No Assigned Tasks Yet"
                  : "No tasks match your search"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {assignedTasks.length === 0
                  ? "Start browsing available tasks to place bids and get work assigned to you."
                  : "Try adjusting your search or filter criteria."}
              </p>
              <Button onClick={() => navigate("/tasks")}>
                Browse Available Tasks
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedTasks.map((task) => (
              <Card
                key={task.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{task.category}</Badge>
                        <Badge
                          className={getStatusColor(task.status)}
                          variant="secondary"
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(task.status)}
                            <span>{getStatusText(task.status)}</span>
                          </div>
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">
                        {task.title}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary mb-1">
                        ₹{task.budget}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.budgetType === "hourly" ? "per hour" : "fixed"}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {task.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {getTimeAgo(task.postedAt)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Star className="w-4 h-4 mr-2" />
                      Customer: {task.customerName}
                    </div>
                    {task.deadline && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {task.taskerPayment && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Your Payment:
                        </span>
                        <span className="font-semibold text-emerald-700">
                          ₹{task.taskerPayment}
                        </span>
                      </div>
                      {task.escrowStatus && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-muted-foreground">
                            Escrow Status:
                          </span>
                          <span
                            className={`font-medium ${
                              task.escrowStatus === "held"
                                ? "text-blue-600"
                                : task.escrowStatus === "released"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {task.escrowStatus.charAt(0).toUpperCase() +
                              task.escrowStatus.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
