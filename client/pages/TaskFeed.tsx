import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
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
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Users,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
  Eye,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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
  const [showFilters, setShowFilters] = useState(false);
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
    "Emergency Help",
    "Handyman",
    "Business Services",
    "Transport & Moving",
    "Events & Personal",
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
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
      !task.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.skillsRequired.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      )
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

    if (filters.isRemote && !task.isRemote) {
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
      case "popular":
        return b.bidsCount - a.bidsCount;
      case "urgent":
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== "" &&
      value !== 0 &&
      value !== false &&
      value !== 25 &&
      value !== 1000,
  ).length;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Enhanced Mobile-Optimized Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-3 lg:py-4">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (window.history.length > 1) {
                      navigate(-1);
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 lg:h-10 lg:w-10"
                >
                  <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Search className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      Browse Tasks
                    </h1>
                    <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                      {sortedTasks.length} tasks available
                    </p>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle - Desktop Only */}
              <div className="hidden lg:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="h-12 px-4 bg-white dark:bg-gray-900 relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-600">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 sm:w-40 h-12 bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="budget-high">Budget: High</SelectItem>
                  <SelectItem value="budget-low">Budget: Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="urgent">Most Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Category Pills - Mobile Optimized */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  filters.category === category ||
                  (category === "All" && !filters.category)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    category: category === "All" ? "" : category,
                  }))
                }
                className="whitespace-nowrap h-8 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          {/* Task Grid/List */}
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {sortedTasks.map((task) => (
              <Card
                key={task.id}
                className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                onClick={() => navigate(`/task/${task.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {task.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getUrgencyColor(task.urgency)}`}
                      >
                        {task.urgency} priority
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveTask(task.id);
                      }}
                      className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      {savedTasks.includes(task.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {task.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {task.description}
                  </p>

                  {/* Skills */}
                  {task.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.skillsRequired.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {task.skillsRequired.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.skillsRequired.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Task Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-lg font-bold text-blue-600 dark:text-blue-400">
                        <IndianRupee className="w-5 h-5 mr-1" />₹{task.budget}
                        {task.budgetType === "hourly" ? "/hr" : ""}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {task.timeEstimate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {task.isRemote ? "Remote" : task.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeAgo(task.postedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-gray-100 dark:bg-gray-800">
                            {task.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.customerName}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            {task.customerRating}
                            {task.customerVerified && (
                              <CheckCircle className="w-3 h-3 ml-1 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {task.bidsCount}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {task.viewsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {sortedTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Try adjusting your search terms or filters to find more tasks.
              </p>
              <Button
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
            </div>
          )}
        </div>

        {/* Filters Dialog */}
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
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
                  Clear All
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Budget Range */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Budget Range
                </label>
                <div className="space-y-3">
                  <Slider
                    value={[filters.minBudget, filters.maxBudget]}
                    onValueChange={([min, max]) =>
                      setFilters((prev) => ({
                        ...prev,
                        minBudget: min,
                        maxBudget: max,
                      }))
                    }
                    max={2000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>₹{filters.minBudget}</span>
                    <span>₹{filters.maxBudget}</span>
                  </div>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="text-sm font-medium mb-3 block">
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

              {/* Location */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Location
                </label>
                <Input
                  placeholder="Enter city or area"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
                <div className="flex items-center space-x-2 mt-3">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={filters.isRemote}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isRemote: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="remote" className="text-sm">
                    Include remote tasks
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowFilters(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
