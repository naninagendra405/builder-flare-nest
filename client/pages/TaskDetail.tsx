import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Calendar,
  Users,
  MessageSquare,
  Share,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Send,
  Phone,
  Shield,
  Home,
  Award,
  Flag,
  Heart,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTasks, type Bid } from "../contexts/TaskContext";
import { useNotifications } from "../contexts/NotificationContext";
import TaskWorkflow from "../components/TaskWorkflow";

// Use Task and Bid interfaces from context

export default function TaskDetail() {
  const { user } = useAuth();
  const { acceptBid, getAllTasks, placeBid, updateTask, getBidsForTask } =
    useTasks();
  const { addNotification, addNotificationForUser } = useNotifications();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const shouldShowBidDialog = searchParams.get("action") === "bid";

  const [showBidDialog, setShowBidDialog] = useState(shouldShowBidDialog);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("1-2-days");
  const [contactMessage, setContactMessage] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  // Get real task data from context
  const allTasks = getAllTasks();
  const task = allTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The task you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/tasks")}>Browse Tasks</Button>
        </div>
      </div>
    );
  }

  // Get dynamic bids for this task
  const bids = getBidsForTask(task?.id || "");

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

  const submitBid = () => {
    if (!bidAmount || !bidMessage) return;

    // Create new bid data (without id, taskId, submittedAt - these are handled by context)
    const bidData = {
      bidderId: user.id,
      bidderName: user.name,
      bidderRating: user.rating || 4.5,
      bidderCompletedTasks: 25, // Mock value
      amount: parseInt(bidAmount),
      message: bidMessage,
      deliveryTime: deliveryTime.replace("-", " "),
      bidderVerified: user.verificationStatus === "verified",
      bidderResponse: "under 1 hour",
    };

    // Add bid using context
    placeBid(task.id, bidData);

    // Notify customer about new bid
    addNotification({
      type: "bid_received",
      title: "New Bid Received!",
      message: `${user.name} placed a bid of ₹${bidAmount} on your task "${task.title}". Review and accept to start work.`,
      priority: "high",
      taskId: task.id,
      fromUser: user.name,
    });

    // Notify tasker about successful bid placement
    addNotification({
      type: "bid_placed",
      title: "Bid Placed Successfully!",
      message: `Your bid of ₹${bidAmount} for "${task.title}" has been submitted. You'll be notified when the customer responds.`,
      priority: "medium",
      taskId: task.id,
      fromUser: "TaskIt System",
    });

    setShowBidDialog(false);
    setBidAmount("");
    setBidMessage("");

    // Show success message
    alert("Bid placed successfully! The customer will be notified.");
  };

  const acceptBidHandler = (bidId: string) => {
    const acceptedBid = bids.find((bid) => bid.id === bidId);

    if (acceptedBid) {
      console.log("Bid accepted:", acceptedBid);

      // Use context to accept bid and assign task
      acceptBid(task.id, bidId, acceptedBid.bidderId, acceptedBid.bidderName);

      // Add notification for the tasker (whose bid was accepted)
      addNotificationForUser(acceptedBid.bidderId, {
        type: "task_update",
        title: "🎉 Bid Accepted!",
        message: `Your bid for "${task.title}" has been accepted! The customer will approve the task soon to start work and secure payment.`,
        priority: "high",
        taskId: task.id,
        fromUser: user.name,
        actionUrl: `/task/${task.id}`,
      });

      // Add notification for the customer (current user)
      addNotification({
        type: "task_update",
        title: "Bid Accepted Successfully",
        message: `${acceptedBid.bidderName}'s bid for "${task.title}" has been accepted. Please approve the task to hold payment in escrow and start work.`,
        priority: "high",
        taskId: task.id,
        fromUser: "TaskIt System",
        actionUrl: `/task/${task.id}`,
      });

      // Show success message
      alert(
        `🎉 Bid accepted! ${acceptedBid.bidderName} has been assigned to this task. Please approve the task to start work and secure payment.`,
      );
    }
  };

  const contactCustomer = () => {
    // TODO: Send message to customer
    console.log("Contacting customer:", contactMessage);
    setShowContactDialog(false);
    setContactMessage("");
  };

  const canUserBid = user.role === "tasker" && task.status === "open";
  const isTaskOwner = user.id === task.customerId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-2" />
                )}
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline">{task.category}</Badge>
                      <Badge
                        className={getUrgencyColor(task.urgency)}
                        variant="secondary"
                      >
                        {task.urgency} priority
                      </Badge>
                      <Badge variant="secondary">{task.status}</Badge>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">
                      {task.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {task.isRemote ? "Remote" : task.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getTimeAgo(task.postedAt)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {task.viewsCount} views
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {task.bidsCount} bids
                      </span>
                    </div>
                  </div>
                  <div className="text-left lg:text-right">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      ₹{task.budget}
                      {task.budgetType === "hourly" ? "/hr" : ""}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {task.timeEstimate}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Skills Required */}
                  {task.skillsRequired.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {task.skillsRequired.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {task.instructions && (
                    <div>
                      <h3 className="font-semibold mb-2">
                        Special Instructions
                      </h3>
                      <p className="text-muted-foreground">
                        {task.instructions}
                      </p>
                    </div>
                  )}

                  {/* Deadline */}
                  {task.deadline && (
                    <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="text-orange-800">
                        <strong>Deadline:</strong>{" "}
                        {new Date(task.deadline).toLocaleDateString()} at{" "}
                        {new Date(task.deadline).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            {task.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {task.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                      >
                        <span className="text-muted-foreground">
                          Image {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bids Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Bids ({bids.length})
                  {canUserBid && (
                    <Button onClick={() => setShowBidDialog(true)}>
                      Place Bid
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback>
                              {bid.bidderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">
                                {bid.bidderName}
                              </h4>
                              {bid.bidderVerified && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                {bid.bidderRating} ({bid.bidderCompletedTasks}{" "}
                                tasks)
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Responds in {bid.bidderResponse}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-2xl font-bold text-primary">
                            ₹{bid.amount}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {bid.deliveryTime}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-3">
                        {bid.message}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                        <span className="text-sm text-muted-foreground">
                          {getTimeAgo(bid.submittedAt)}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            Message
                          </Button>
                          {isTaskOwner && (
                            <Button
                              size="sm"
                              onClick={() => acceptBidHandler(bid.id)}
                            >
                              Accept Bid
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Workflow */}
            {(task.status === "bid_accepted" ||
              task.status === "approved" ||
              task.status === "in_progress" ||
              task.status === "completed") && <TaskWorkflow task={task} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg">
                      {task.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{task.customerName}</h3>
                      {task.customerVerified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      {task.customerRating} rating
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tasks Posted:</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Completion Rate:</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Avg Response:</span>
                    <span className="font-medium">under 2 hours</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Dialog
                    open={showContactDialog}
                    onOpenChange={setShowContactDialog}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact {task.customerName}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Write your message..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          rows={4}
                        />
                        <Button onClick={contactCustomer} className="w-full">
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canUserBid && (
                  <Button
                    className="w-full"
                    onClick={() => setShowBidDialog(true)}
                  >
                    <IndianRupee className="w-4 h-4 mr-2" />
                    Place Bid
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
                <Button variant="outline" className="w-full">
                  <Flag className="w-4 h-4 mr-2" />
                  Report Task
                </Button>
              </CardContent>
            </Card>

            {/* Similar Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <h4 className="font-medium text-sm mb-1">
                        Bathroom sink repair
                      </h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>₹5,417</span>
                        <span>5 bids</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bid Dialog */}
      <Dialog open={showBidDialog} onOpenChange={setShowBidDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Place Your Bid</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Task Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">{task.title}</h3>
              <div className="flex items-center justify-between text-sm">
                <span>Budget: ₹{task.budget}</span>
                <span>Current bids: {bids.length}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bidAmount">Your Bid Amount *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="bidAmount"
                    type="number"
                    placeholder="0.00"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <select
                  id="deliveryTime"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="same-day">Same day</option>
                  <option value="1-2-days">1-2 days</option>
                  <option value="3-5-days">3-5 days</option>
                  <option value="1-week">1 week</option>
                  <option value="2-weeks">2+ weeks</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="bidMessage">Cover Letter *</Label>
              <Textarea
                id="bidMessage"
                placeholder="Explain why you're the best fit for this task..."
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                💡 Bidding Tips
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be competitive but fair with your pricing</li>
                <li>• Highlight your relevant experience</li>
                <li>• Ask clarifying questions if needed</li>
                <li>• Be realistic about delivery times</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBidDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={submitBid}
                disabled={!bidAmount || !bidMessage}
              >
                Submit Bid
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
