import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Users,
  Bookmark,
  BookmarkCheck,
  Eye,
  MessageSquare,
  Calendar,
  Home,
  SlidersHorizontal,
  Grid,
  List,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTasks } from "../contexts/TaskContext";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  location: string;
  isRemote: boolean;
  customerName: string;
  customerRating: number;
  postedAt: string;
  deadline?: string;
  urgency: "low" | "medium" | "high";
  skillsRequired: string[];
  bidsCount: number;
  viewsCount: number;
  images: string[];
  timeEstimate: string;
  customerVerified: boolean;
  distance?: number;
  customerId: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
}

export default function TaskFeed() {
  const { user } = useAuth();
  const { getAllTasks } = useTasks();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedTasks, setSavedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minBudget: 0,
    maxBudget: 1000,
    location: "",
    isRemote: false,
    urgency: "",
    radius: 25,
  });
  const [sortBy, setSortBy] = useState("newest");

  if (!user) {
    navigate("/login");
    return null;
  }

  const tasks = getAllTasks();

  const categories = [
    "All",
    "Home Repair",
    "Digital Services",
    "Moving Help",
    "Cleaning",
    "Tutoring",
    "Emergency Help",
    "Handyman",
    "Business Services",
    "Transport & Moving",
    "Events & Personal",
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      case "open":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const toggleSaveTask = (taskId: string) => {
    setSavedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.category &&
      filters.category !== "All" &&
      task.category !== filters.category
    ) {
      return false;
    }
    if (task.budget < filters.minBudget || task.budget > filters.maxBudget) {
      return false;
    }
    if (filters.urgency && task.urgency !== filters.urgency) {
      return false;
    }
    if (!filters.isRemote && task.distance && task.distance > filters.radius) {
      return false;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "budget-high":
        return b.budget - a.budget;
      case "budget-low":
        return a.budget - b.budget;
      case "deadline":
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "distance":
        return (a.distance || 0) - (b.distance || 0);
      default: // newest
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

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
                  src="https://cdn.builder.io/api/v1/image/assets%2F49df43ed9ff0405e8e16cefcd448c514%2F4f70d3bad8334dbfa7beca7d1e69b919?format=webp&width=800"
                  alt="DOZO Logo"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium hidden sm:block">{user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Find Tasks</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Discover opportunities that match your skills and schedule
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {/* Search */}
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </form>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Advanced Filters */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advanced Filters</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Budget Range
                        </label>
                        <div className="px-3">
                          <Slider
                            value={[filters.minBudget, filters.maxBudget]}
                            onValueChange={([min, max]) =>
                              setFilters((prev) => ({
                                ...prev,
                                minBudget: min,
                                maxBudget: max,
                              }))
                            }
                            max={1000}
                            step={10}
                            className="mb-2"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>₹{filters.minBudget}</span>
                            <span>₹{filters.maxBudget}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Urgency
                        </label>
                        <Select
                          value={filters.urgency}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, urgency: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Any urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Any urgency</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Distance ({filters.radius} miles)
                        </label>
                        <Slider
                          value={[filters.radius]}
                          onValueChange={([value]) =>
                            setFilters((prev) => ({ ...prev, radius: value }))
                          }
                          max={50}
                          step={5}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="budget-high">
                      Budget: High to Low
                    </SelectItem>
                    <SelectItem value="budget-low">
                      Budget: Low to High
                    </SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode - Hidden on mobile */}
                <div className="hidden sm:flex border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-muted-foreground">
            {sortedTasks.length} tasks found
          </p>
          {user.role === "customer" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/task-suggestions")}
              >
                💡 Get Task Ideas
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/create-task")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Post a Task
              </Button>
            </div>
          )}
        </div>

        {/* Tasks Grid/List - Always grid on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedTasks.map((task, index) => (
            <Card
              key={task.id}
              className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => navigate(`/task/${task.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-xs transition-all duration-200 hover:scale-105 hover:shadow-sm"
                      >
                        {task.category}
                      </Badge>
                      <Badge
                        className={`text-xs ${getUrgencyColor(task.urgency)} transition-all duration-200 hover:scale-105`}
                        variant="secondary"
                      >
                        {task.urgency}
                      </Badge>
                      {task.status !== "open" && (
                        <Badge
                          className={`text-xs ${getStatusColor(task.status)}`}
                          variant="secondary"
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                      )}
                      {task.customerVerified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <CardTitle className="text-base md:text-lg line-clamp-2 mb-2">
                      {task.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveTask(task.id);
                    }}
                    className="ml-2 p-2"
                  >
                    {savedTasks.includes(task.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Budget */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-lg font-bold text-primary">
                      <IndianRupee className="w-5 h-5 mr-1" />₹{task.budget}
                      {task.budgetType === "hourly" ? "/hr" : ""}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {task.timeEstimate}
                    </div>
                  </div>

                  {/* Location and Distance */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {task.isRemote ? "Remote" : task.location}
                    {task.distance && (
                      <span className="ml-2">• {task.distance} miles away</span>
                    )}
                  </div>

                  {/* Skills */}
                  {task.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.skillsRequired.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {task.skillsRequired.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{task.skillsRequired.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {task.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">
                        {task.customerName}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-xs">{task.customerRating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {task.bidsCount}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {task.viewsCount}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeAgo(task.postedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Deadline Warning */}
                  {task.deadline && (
                    <div className="flex items-center text-sm text-orange-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user.role === "customer") {
                          navigate("/task-suggestions");
                        } else {
                          navigate(`/task/${task.id}`);
                        }
                      }}
                    >
                      {user.role === "customer"
                        ? "Get Task Ideas"
                        : "View & Bid"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/chat?task=${task.id}`);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedTasks.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more tasks
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    category: "",
                    minBudget: 0,
                    maxBudget: 1000,
                    location: "",
                    isRemote: false,
                    urgency: "",
                    radius: 25,
                  });
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
