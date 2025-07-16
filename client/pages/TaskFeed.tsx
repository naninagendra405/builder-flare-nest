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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Users,
  Bookmark,
  BookmarkCheck,
  Eye,
  MessageSquare,
  Calendar,
  Zap,
  SlidersHorizontal,
  Grid,
  List,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedTasks, setSavedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: "",
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

  const tasks: Task[] = [
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
      customerRating: 4.8,
      postedAt: "2024-01-15T10:30:00Z",
      deadline: "2024-01-18",
      urgency: "high",
      skillsRequired: ["Plumbing", "Repair"],
      bidsCount: 12,
      viewsCount: 67,
      images: [],
      timeEstimate: "2-3 hours",
      customerVerified: true,
      distance: 2.3,
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
      customerRating: 4.9,
      postedAt: "2024-01-14T14:15:00Z",
      urgency: "medium",
      skillsRequired: ["Graphic Design", "Branding", "Adobe Illustrator"],
      bidsCount: 24,
      viewsCount: 156,
      images: [],
      timeEstimate: "3-5 days",
      customerVerified: true,
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
      customerRating: 4.6,
      postedAt: "2024-01-14T09:45:00Z",
      deadline: "2024-01-16",
      urgency: "high",
      skillsRequired: ["Moving", "Physical Labor"],
      bidsCount: 8,
      viewsCount: 43,
      images: [],
      timeEstimate: "4-6 hours",
      customerVerified: false,
      distance: 5.7,
    },
    {
      id: "4",
      title: "Assembly IKEA furniture",
      description:
        "Need someone to assemble a bedroom set from IKEA. Instructions included, some tools might be needed.",
      category: "Handyman",
      budget: 60,
      budgetType: "fixed",
      location: "Queens, NY",
      isRemote: false,
      customerName: "Emily Davis",
      customerRating: 4.7,
      postedAt: "2024-01-13T16:20:00Z",
      urgency: "low",
      skillsRequired: ["Assembly", "Tools"],
      bidsCount: 15,
      viewsCount: 89,
      images: [],
      timeEstimate: "2-3 hours",
      customerVerified: true,
      distance: 8.2,
    },
    {
      id: "5",
      title: "Website bug fixes",
      description:
        "Small e-commerce site has a few bugs that need fixing. React/Node.js experience required.",
      category: "Digital Services",
      budget: 45,
      budgetType: "hourly",
      location: "Remote",
      isRemote: true,
      customerName: "Small Business Co.",
      customerRating: 4.4,
      postedAt: "2024-01-13T11:10:00Z",
      urgency: "medium",
      skillsRequired: ["React", "Node.js", "JavaScript", "Bug Fixing"],
      bidsCount: 19,
      viewsCount: 134,
      images: [],
      timeEstimate: "1-2 days",
      customerVerified: true,
    },
  ];

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
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-primary">TaskIt</span>
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
              <span className="font-medium">{user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Find Tasks</h1>
          <p className="text-muted-foreground">
            Discover opportunities that match your skills and schedule
          </p>
        </div>

                {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>

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
                          <span>${filters.minBudget}</span>
                          <span>${filters.maxBudget}</span>
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
                <SelectTrigger className="w-40">
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

              {/* View Mode */}
              <div className="flex border rounded-lg p-1">
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
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {sortedTasks.length} tasks found
          </p>
          {user.role === "customer" && (
            <Button variant="outline" onClick={() => navigate("/create-task")}>
              Post a Task
            </Button>
          )}
        </div>

        {/* Tasks Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {sortedTasks.map((task) => (
            <Card
              key={task.id}
              className={`hover:shadow-lg transition-all cursor-pointer ${viewMode === "list" ? "flex" : ""}`}
              onClick={() => navigate(`/task/${task.id}`)}
            >
              <CardHeader className={viewMode === "list" ? "flex-1" : ""}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{task.category}</Badge>
                      <Badge
                        className={getUrgencyColor(task.urgency)}
                        variant="secondary"
                      >
                        {task.urgency}
                      </Badge>
                      {task.customerVerified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {task.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
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
                  >
                    {savedTasks.includes(task.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className={viewMode === "list" ? "flex-1" : ""}>
                <div className="space-y-3">
                  {/* Budget */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-lg font-bold text-primary">
                      <DollarSign className="w-5 h-5 mr-1" />${task.budget}
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
                      <span className="text-sm">{task.customerName}</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-xs">{task.customerRating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {task.bidsCount} bids
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
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/task/${task.id}?action=bid`);
                      }}
                    >
                      Place Bid
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