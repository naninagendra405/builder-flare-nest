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
                onClick={() => navigate("/tasks")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fb7fcb38896684c25a67a71f6b5b0365e%2F81896caa38e7430aac41e48cb8db0102?format=webp&width=800"
                    alt="TaskIt Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
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
        <TaskSuggestions />
      </div>
    </div>
  );
}
