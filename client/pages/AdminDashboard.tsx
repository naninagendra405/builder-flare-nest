import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Ban,
  Mail,
  Phone,
  MapPin,
  Star,
  Zap,
  Calendar,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "tasker";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  tasksCompleted: number;
  rating: number;
  totalEarned?: number;
  totalSpent?: number;
  location: string;
  verificationStatus: "verified" | "pending" | "rejected";
}

interface Task {
  id: string;
  title: string;
  category: string;
  status: "open" | "in_progress" | "completed" | "disputed" | "cancelled";
  budget: number;
  customerName: string;
  taskerName?: string;
  dateCreated: string;
  dateCompleted?: string;
  location: string;
  bidsCount: number;
}

interface Dispute {
  id: string;
  taskId: string;
  taskTitle: string;
  customer: string;
  tasker: string;
  reason: string;
  status: "open" | "investigating" | "resolved";
  dateCreated: string;
  amount: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (!user || user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const stats = [
    { label: "Total Users", value: "12,847", icon: Users, change: "+12%" },
    { label: "Active Tasks", value: "3,456", icon: Briefcase, change: "+8%" },
    {
      label: "Revenue",
      value: "₹74,67,648",
      icon: DollarSign,
      change: "+15%",
    },
    {
      label: "Success Rate",
      value: "94.2%",
      icon: TrendingUp,
      change: "+2%",
    },
  ];

  const users: User[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      role: "customer",
      status: "active",
      joinDate: "2024-01-15",
      tasksCompleted: 23,
      rating: 4.8,
      totalSpent: 1245,
      location: "New York, NY",
      verificationStatus: "verified",
    },
    {
      id: "2",
      name: "Mike Wilson",
      email: "mike@email.com",
      role: "tasker",
      status: "active",
      joinDate: "2024-01-10",
      tasksCompleted: 47,
      rating: 4.9,
      totalEarned: 3456,
      location: "Los Angeles, CA",
      verificationStatus: "verified",
    },
    {
      id: "3",
      name: "John Smith",
      email: "john@email.com",
      role: "tasker",
      status: "pending",
      joinDate: "2024-01-20",
      tasksCompleted: 0,
      rating: 0,
      location: "Chicago, IL",
      verificationStatus: "pending",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@email.com",
      role: "customer",
      status: "suspended",
      joinDate: "2024-01-05",
      tasksCompleted: 12,
      rating: 3.2,
      totalSpent: 567,
      location: "Houston, TX",
      verificationStatus: "verified",
    },
  ];

  const tasks: Task[] = [
    {
      id: "task_001",
      title: "Fix kitchen sink leak",
      category: "Home Repair",
      status: "completed",
      budget: 75,
      customerName: "Sarah Johnson",
      taskerName: "Mike Wilson",
      dateCreated: "2024-01-15",
      dateCompleted: "2024-01-16",
      location: "Manhattan, NY",
      bidsCount: 12,
    },
    {
      id: "task_002",
      title: "Logo design for startup",
      category: "Digital Services",
      status: "in_progress",
      budget: 250,
      customerName: "TechCorp Inc.",
      taskerName: "Creative Studio",
      dateCreated: "2024-01-14",
      location: "Remote",
      bidsCount: 8,
    },
    {
      id: "task_003",
      title: "Help with moving",
      category: "Emergency Help",
      status: "disputed",
      budget: 120,
      customerName: "John Doe",
      taskerName: "Moving Helper",
      dateCreated: "2024-01-13",
      location: "Brooklyn, NY",
      bidsCount: 5,
    },
    {
      id: "task_004",
      title: "Garden cleanup",
      category: "Home Repair",
      status: "open",
      budget: 80,
      customerName: "Mary Smith",
      dateCreated: "2024-01-12",
      location: "Queens, NY",
      bidsCount: 3,
    },
  ];

  const disputes: Dispute[] = [
    {
      id: "dispute_001",
      taskId: "task_003",
      taskTitle: "Help with moving",
      customer: "John Doe",
      tasker: "Moving Helper",
      reason: "Work not completed as agreed",
      status: "investigating",
      dateCreated: "2024-01-14",
      amount: 120,
    },
    {
      id: "dispute_002",
      taskId: "task_005",
      taskTitle: "Website development",
      customer: "Small Business",
      tasker: "Web Developer",
      reason: "Poor quality of work",
      status: "open",
      dateCreated: "2024-01-13",
      amount: 500,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
      case "in_progress":
      case "investigating":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
      case "disputed":
      case "rejected":
        return "bg-red-100 text-red-800";
      case "open":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    console.log(`${action} user ${userId}`);
    // TODO: Implement actual user actions
  };

  const handleTaskAction = (action: string, taskId: string) => {
    console.log(`${action} task ${taskId}`);
    // TODO: Implement actual task actions
  };

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
              <Badge variant="destructive">Admin</Badge>
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
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
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="w-8 h-8 mr-3 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users, tasks, and platform operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "tasker" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(user.status)}
                            variant="secondary"
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.tasksCompleted}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {user.rating > 0 ? user.rating.toFixed(1) : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleUserAction("suspend", user.id)
                                }
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Tasker</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {task.bidsCount} bids • {task.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(task.status)}
                            variant="secondary"
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${task.budget}
                        </TableCell>
                        <TableCell>{task.customerName}</TableCell>
                        <TableCell>{task.taskerName || "N/A"}</TableCell>
                        <TableCell>
                          {new Date(task.dateCreated).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Moderate
                              </DropdownMenuItem>
                              {task.status === "disputed" && (
                                <DropdownMenuItem>
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Resolve Dispute
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Dispute Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div
                      key={dispute.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{dispute.taskTitle}</h4>
                        <Badge
                          className={getStatusColor(dispute.status)}
                          variant="secondary"
                        >
                          {dispute.status}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Customer:
                          </span>{" "}
                          {dispute.customer}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tasker:</span>{" "}
                          {dispute.tasker}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>{" "}
                          ${dispute.amount}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>{" "}
                          {new Date(dispute.dateCreated).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reason:</span>{" "}
                        {dispute.reason}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm">Investigate</Button>
                        <Button size="sm" variant="outline">
                          Contact Parties
                        </Button>
                        <Button size="sm" variant="outline">
                          View Task Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>New Users (This Month)</span>
                      <span className="font-bold">+1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tasks Posted</span>
                      <span className="font-bold">+856</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tasks Completed</span>
                      <span className="font-bold">+743</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Success Rate</span>
                      <span className="font-bold text-green-600">94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold">₹74,67,648</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Platform Fees</span>
                      <span className="font-bold">₹7,46,765</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Processing Fees</span>
                      <span className="font-bold">₹1,86,537</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Net Revenue</span>
                      <span className="font-bold text-green-600">
                        ₹65,34,346
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* User Details Modal */}
        {selectedUser && (
          <Dialog
            open={!!selectedUser}
            onOpenChange={() => setSelectedUser(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg">
                      {selectedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedUser.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedUser.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        variant={
                          selectedUser.role === "tasker"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedUser.role}
                      </Badge>
                      <Badge
                        className={getStatusColor(selectedUser.status)}
                        variant="secondary"
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Account Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          Joined:{" "}
                          {new Date(selectedUser.joinDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          {selectedUser.location}
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                          Verification:{" "}
                          <Badge
                            className={`ml-2 ${getStatusColor(
                              selectedUser.verificationStatus,
                            )}`}
                            variant="secondary"
                          >
                            {selectedUser.verificationStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Activity Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tasks Completed:</span>
                          <span className="font-medium">
                            {selectedUser.tasksCompleted}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-medium">
                              {selectedUser.rating > 0
                                ? selectedUser.rating.toFixed(1)
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                        {selectedUser.totalEarned && (
                          <div className="flex justify-between">
                            <span>Total Earned:</span>
                            <span className="font-medium">
                              ${selectedUser.totalEarned}
                            </span>
                          </div>
                        )}
                        {selectedUser.totalSpent && (
                          <div className="flex justify-between">
                            <span>Total Spent:</span>
                            <span className="font-medium">
                              ${selectedUser.totalSpent}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button>Edit User</Button>
                  <Button variant="outline">Send Message</Button>
                  <Button variant="outline">View Tasks</Button>
                  {selectedUser.status === "active" && (
                    <Button variant="destructive">Suspend</Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
