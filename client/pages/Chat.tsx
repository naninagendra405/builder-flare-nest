import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Send,
  Paperclip,
  Image,
  MoreHorizontal,
  Phone,
  Video,
  Info,
  Search,
  Star,
  MapPin,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  FileText,
  Camera,
  Smile,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file" | "system";
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface Chat {
  id: string;
  taskId: string;
  taskTitle: string;
  participants: {
    id: string;
    name: string;
    role: "customer" | "tasker";
    avatar?: string;
    online: boolean;
    lastSeen?: string;
  }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  taskStatus: "open" | "in_progress" | "completed" | "disputed";
  taskBudget: number;
}

export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  // Mock chat data
  const chats: Chat[] = [
    {
      id: "chat_1",
      taskId: "task_123",
      taskTitle: "Fix kitchen sink leak",
      participants: [
        {
          id: "user_1",
          name: "Sarah Johnson",
          role: "customer",
          online: true,
        },
        {
          id: "user_2",
          name: "Mike Wilson",
          role: "tasker",
          online: false,
          lastSeen: "2024-01-15T14:30:00Z",
        },
      ],
      lastMessage: "When can you start the work?",
      lastMessageTime: "2024-01-15T15:45:00Z",
      unreadCount: 2,
      taskStatus: "in_progress",
      taskBudget: 75,
    },
    {
      id: "chat_2",
      taskId: "task_124",
      taskTitle: "Logo design for startup",
      participants: [
        {
          id: "user_3",
          name: "TechCorp Inc.",
          role: "customer",
          online: true,
        },
        {
          id: "user_4",
          name: "Creative Studio",
          role: "tasker",
          online: true,
        },
      ],
      lastMessage: "Here are the initial concepts",
      lastMessageTime: "2024-01-15T13:20:00Z",
      unreadCount: 0,
      taskStatus: "in_progress",
      taskBudget: 250,
    },
    {
      id: "chat_3",
      taskId: "task_125",
      taskTitle: "Help with moving",
      participants: [
        {
          id: "user_5",
          name: "John Doe",
          role: "customer",
          online: false,
          lastSeen: "2024-01-15T10:15:00Z",
        },
        {
          id: "user_6",
          name: "Moving Helper",
          role: "tasker",
          online: false,
          lastSeen: "2024-01-15T12:00:00Z",
        },
      ],
      lastMessage: "Task completed successfully!",
      lastMessageTime: "2024-01-14T18:30:00Z",
      unreadCount: 0,
      taskStatus: "completed",
      taskBudget: 120,
    },
  ];

  // Mock messages for selected chat
  const messages: Message[] = [
    {
      id: "msg_1",
      senderId: "user_1",
      content: "Hi! I saw your bid on my kitchen sink repair task.",
      timestamp: "2024-01-15T14:00:00Z",
      type: "text",
    },
    {
      id: "msg_2",
      senderId: "user_2",
      content:
        "Hello! Yes, I'd be happy to help. I have 10+ years of plumbing experience.",
      timestamp: "2024-01-15T14:05:00Z",
      type: "text",
    },
    {
      id: "msg_3",
      senderId: "user_1",
      content: "Great! Can you come take a look this afternoon?",
      timestamp: "2024-01-15T14:10:00Z",
      type: "text",
    },
    {
      id: "msg_4",
      senderId: "user_2",
      content:
        "Absolutely! I'm available after 3 PM. Here's a photo of similar work I've done recently.",
      timestamp: "2024-01-15T14:15:00Z",
      type: "text",
    },
    {
      id: "msg_5",
      senderId: "system",
      content: "Task has been accepted by Mike Wilson",
      timestamp: "2024-01-15T14:20:00Z",
      type: "system",
    },
    {
      id: "msg_6",
      senderId: "user_1",
      content: "Perfect! When can you start the work?",
      timestamp: "2024-01-15T15:45:00Z",
      type: "text",
    },
  ];

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);
  const otherParticipant = selectedChat?.participants.find(
    (p) => p.id !== user.id,
  );

  useEffect(() => {
    // Auto-select first chat if none selected
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [selectedChatId, chats]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    // TODO: Send message to backend
    console.log("Sending message:", messageInput);
    setMessageInput("");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.participants.some((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <div className="h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md">
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

      <div className="flex-1 flex overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-80 border-r bg-background/50 flex flex-col md:flex">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => {
              const otherParticipant = chat.participants.find(
                (p) => p.id !== user.id,
              );
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedChatId === chat.id ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>
                          {otherParticipant?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {otherParticipant?.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium truncate">
                          {otherParticipant?.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {getTimeAgo(chat.lastMessageTime)}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-primary mb-1 truncate">
                        {chat.taskTitle}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          className={getStatusColor(chat.taskStatus)}
                          variant="secondary"
                        >
                          {chat.taskStatus.replace("_", " ")}
                        </Badge>
                        <span className="text-sm font-semibold text-primary">
                          ${chat.taskBudget}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col hidden md:flex">
            {/* Chat Header */}
            <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {otherParticipant?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {otherParticipant?.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{otherParticipant?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {otherParticipant?.online
                        ? "Online"
                        : `Last seen ${getTimeAgo(otherParticipant?.lastSeen || "")}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTaskDetails(true)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Block User</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Report Issue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Task Info Bar */}
              <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {selectedChat.taskTitle}
                    </span>
                    <Badge
                      className={getStatusColor(selectedChat.taskStatus)}
                      variant="secondary"
                    >
                      {selectedChat.taskStatus.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-primary font-semibold">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {selectedChat.taskBudget}
                    </span>
                    <Button size="sm" onClick={() => setShowTaskDetails(true)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user.id;
                const isSystemMessage = message.type === "system";

                if (isSystemMessage) {
                  return (
                    <div key={message.id} className="text-center">
                      <div className="inline-flex items-center px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                        <Info className="w-3 h-3 mr-2" />
                        {message.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Image className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Smile className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="pr-12"
                  />
                  <Button
                    size="sm"
                    onClick={sendMessage}
                    disabled={!messageInput.trim()}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">
                Select a conversation
              </h3>
              <p className="text-muted-foreground">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {selectedChat && (
        <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {selectedChat.taskTitle}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Badge
                    className={getStatusColor(selectedChat.taskStatus)}
                    variant="secondary"
                  >
                    {selectedChat.taskStatus.replace("_", " ")}
                  </Badge>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {selectedChat.taskBudget}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Customer</h4>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {selectedChat.participants
                          .find((p) => p.role === "customer")
                          ?.name.split(" ")
                          .map((n) => n[0])
                          .join("") || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {
                          selectedChat.participants.find(
                            (p) => p.role === "customer",
                          )?.name
                        }
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        4.8 (23 reviews)
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tasker</h4>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {selectedChat.participants
                          .find((p) => p.role === "tasker")
                          ?.name.split(" ")
                          .map((n) => n[0])
                          .join("") || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {
                          selectedChat.participants.find(
                            (p) => p.role === "tasker",
                          )?.name
                        }
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        4.9 (67 reviews)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedChat.taskStatus === "in_progress" && (
                <div className="flex space-x-2">
                  <Button className="flex-1">Mark as Complete</Button>
                  <Button variant="outline" className="flex-1">
                    Request Changes
                  </Button>
                </div>
              )}

              {selectedChat.taskStatus === "completed" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">
                      Task completed successfully!
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Payment has been released to the tasker.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
