import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Users,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskSuggestions from "../components/TaskSuggestions";

// Component for showing available tasks to taskers
function TaskerTaskFeed() {
  const { getAllTasks } = useTasks();
  const navigate = useNavigate();

  const allTasks = getAllTasks();
  const availableTasks = allTasks.filter((task) => task.status === "open");

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold">Available Tasks</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Find tasks that match your skills and start earning today
        </p>
        <div className="text-sm text-muted-foreground">
          {availableTasks.length} tasks available
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTasks.map((task) => (
          <Card
            key={task.id}
            className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => navigate(`/task/${task.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    <Badge
                      className={`text-xs ${getUrgencyColor(task.urgency)}`}
                      variant="secondary"
                    >
                      {task.urgency}
                    </Badge>
                    {task.customerVerified && (
                      <Badge variant="default" className="text-xs bg-green-600">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base md:text-lg line-clamp-2 mb-2">
                    {task.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {task.description}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Budget */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    {task.budget}
                    {task.budgetType === "hourly" ? "/hr" : ""}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.timeEstimate}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {task.isRemote ? "Remote" : task.location}
                  {task.distance && (
                    <span className="ml-2">�� {task.distance} miles away</span>
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

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
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

                {/* Customer Info */}
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium">
                    {task.customerName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">
                    {task.customerName}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span className="text-xs">{task.customerRating}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/task/${task.id}`);
                  }}
                >
                  View Details & Bid
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No tasks available</h3>
          <p className="text-muted-foreground">
            Check back later for new opportunities
          </p>
        </div>
      )}
    </div>
  );
}

export default function TaskSuggestionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

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
                onClick={() =>
                  navigate(user.role === "customer" ? "/dashboard" : "/tasks")
                }
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
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium hidden sm:block">{user.name}</span>
              <div className="text-xs text-muted-foreground capitalize">
                {user.role}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {user.role === "customer" ? <TaskSuggestions /> : <TaskerTaskFeed />}
      </div>
    </div>
  );
}
