import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Lightbulb,
  TrendingUp,
  Plus,
  Shuffle,
} from "lucide-react";
import { getRandomTasks, type SuggestedTask } from "../data/suggestedTasks";
import { useNavigate } from "react-router-dom";

export default function TaskSuggestions() {
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>(
    getRandomTasks(6),
  );
  const navigate = useNavigate();

  const refreshSuggestions = () => {
    setSuggestedTasks(getRandomTasks(6));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <TrendingUp className="w-3 h-3 text-red-600" />;
      case "medium":
        return <Clock className="w-3 h-3 text-yellow-600" />;
      default:
        return <Star className="w-3 h-3 text-green-600" />;
    }
  };

  const handleCreateTask = (task: SuggestedTask) => {
    // Navigate to create task page with pre-filled data
    navigate("/create-task", {
      state: {
        suggestedTask: task,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Task Suggestions</h2>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Can't find what you're looking for? Here are some popular tasks that
          others are hiring for
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshSuggestions}
          className="space-x-2"
        >
          <Shuffle className="w-4 h-4" />
          <span>Get New Suggestions</span>
        </Button>
      </div>

      {/* Task Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedTasks.map((task) => (
          <Card
            key={task.id}
            className="hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => handleCreateTask(task)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    <Badge
                      className={`text-xs ${getPriorityColor(task.priority)}`}
                      variant="secondary"
                    >
                      {task.priority} priority
                    </Badge>
                  </div>
                  <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {task.title}
                  </CardTitle>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="ml-3 flex-shrink-0">
                  {getUrgencyIcon(task.urgency)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Budget & Duration */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-bold text-primary">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {task.estimatedBudget}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {task.estimatedDuration}
                  </div>
                </div>

                {/* Location */}
                {task.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {task.location}
                  </div>
                )}

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {task.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{task.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  size="sm"
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateTask(task);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post This Task
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center pt-6 border-t">
        <p className="text-muted-foreground mb-4">
          Don't see what you need? Create your own custom task
        </p>
        <Button onClick={() => navigate("/create-task")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Task
        </Button>
      </div>
    </div>
  );
}
