import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Briefcase,
  Shield,
  X,
  CheckCheck,
  Filter,
  Search,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [filter, setFilter] = useState("all");

  if (!user) {
    navigate("/login");
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bid":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-purple-600" />;
      case "task_update":
        return <Briefcase className="w-5 h-5 text-orange-600" />;
      case "system":
        return <Shield className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string, read: boolean) => {
    if (read) return "";
    switch (priority) {
      case "high":
        return "border-l-4 border-red-500 bg-red-50";
      case "medium":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-4 border-blue-500 bg-blue-50";
      default:
        return "";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "bid":
        return notification.type === "bid";
      case "message":
        return notification.type === "message";
      case "payment":
        return notification.type === "payment";
      case "task":
        return notification.type === "task_update";
      default:
        return true;
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <Bell className="w-6 md:w-8 h-6 md:h-8 mr-2 md:mr-3 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Stay updated with your tasks and messages
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="w-full sm:w-auto"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read ({unreadCount})
              </Button>
            )}
            <Button
              variant="outline"
              onClick={clearAll}
              className="w-full sm:w-auto"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {notifications.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {unreadCount}
              </div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter((n) => n.type === "bid").length}
              </div>
              <div className="text-sm text-muted-foreground">Bids</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {notifications.filter((n) => n.type === "message").length}
              </div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="bid">Bids</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
            <TabsTrigger value="task">Tasks</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        <Card>
          <CardContent className="p-0">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p>
                  {filter === "all"
                    ? "You're all caught up!"
                    : `No ${filter} notifications found`}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-muted/50 cursor-pointer transition-colors ${getPriorityColor(
                      notification.priority,
                      notification.read,
                    )} ${!notification.read ? "bg-blue-50/50" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4
                              className={`text-lg font-semibold ${
                                !notification.read
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <p className="text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          {notification.fromUser && (
                            <span>from {notification.fromUser}</span>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {notification.type.replace("_", " ")}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={
                              notification.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : notification.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline">Load More Notifications</Button>
          </div>
        )}
      </div>
    </div>
  );
}
