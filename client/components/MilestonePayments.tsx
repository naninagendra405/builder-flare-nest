import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Clock,
  IndianRupee,
  Plus,
  Trash2,
  Target,
  AlertTriangle,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate?: string;
  status: "pending" | "in_progress" | "completed" | "paid";
  createdAt: string;
}

interface MilestonePaymentsProps {
  taskId: string;
  totalBudget: number;
  isCustomer: boolean;
  isTasker: boolean;
}

export default function MilestonePayments({
  taskId,
  totalBudget,
  isCustomer,
  isTasker,
}: MilestonePaymentsProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    amount: 0,
    dueDate: "",
  });

  const totalMilestoneAmount = milestones.reduce(
    (sum, milestone) => sum + milestone.amount,
    0,
  );
  const remainingBudget = totalBudget - totalMilestoneAmount;

  const handleCreateMilestone = () => {
    if (!newMilestone.title || newMilestone.amount <= 0) {
      addNotification({
        type: "error",
        title: "Invalid Milestone",
        message: "Please provide a title and valid amount for the milestone.",
        priority: "medium",
        fromUser: "TaskIt System",
      });
      return;
    }

    if (totalMilestoneAmount + newMilestone.amount > totalBudget) {
      addNotification({
        type: "error",
        title: "Budget Exceeded",
        message: "Milestone amount exceeds remaining budget.",
        priority: "medium",
        fromUser: "TaskIt System",
      });
      return;
    }

    const milestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestone.title,
      description: newMilestone.description,
      amount: newMilestone.amount,
      dueDate: newMilestone.dueDate,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({ title: "", description: "", amount: 0, dueDate: "" });
    setShowCreateDialog(false);

    addNotification({
      type: "task_update",
      title: "Milestone Created",
      message: `Milestone "${milestone.title}" created for ₹${milestone.amount}`,
      priority: "medium",
      fromUser: "TaskIt System",
      taskId,
    });
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    setMilestones(milestones.filter((m) => m.id !== milestoneId));
  };

  const handleStartMilestone = (milestoneId: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "in_progress" } : m,
      ),
    );
  };

  const handleCompleteMilestone = (milestoneId: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "completed" } : m,
      ),
    );
  };

  const handlePayMilestone = (milestoneId: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "paid" } : m,
      ),
    );

    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      addNotification({
        type: "payment",
        title: "Milestone Payment Released",
        message: `Payment of ₹${milestone.amount} released for milestone "${milestone.title}"`,
        priority: "high",
        fromUser: "TaskIt System",
        taskId,
      });
    }
  };

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <Target className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "paid":
        return <IndianRupee className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Milestone Payments</span>
          </CardTitle>
          {isCustomer && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Milestone</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="milestone-title">Milestone Title</Label>
                    <Input
                      id="milestone-title"
                      placeholder="e.g., Design mockups completed"
                      value={newMilestone.title}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="milestone-description">Description</Label>
                    <Textarea
                      id="milestone-description"
                      placeholder="Describe what needs to be completed for this milestone"
                      value={newMilestone.description}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="milestone-amount">Amount (₹)</Label>
                      <Input
                        id="milestone-amount"
                        type="number"
                        placeholder="0"
                        value={newMilestone.amount || ""}
                        onChange={(e) =>
                          setNewMilestone({
                            ...newMilestone,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="milestone-date">
                        Due Date (Optional)
                      </Label>
                      <Input
                        id="milestone-date"
                        type="date"
                        value={newMilestone.dueDate}
                        onChange={(e) =>
                          setNewMilestone({
                            ...newMilestone,
                            dueDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Total Budget:</span>
                      <span className="font-semibold">₹{totalBudget}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Allocated to Milestones:</span>
                      <span className="font-semibold">
                        ₹{totalMilestoneAmount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining:</span>
                      <span className="font-semibold">₹{remainingBudget}</span>
                    </div>
                  </div>

                  {remainingBudget < newMilestone.amount && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Milestone amount exceeds remaining budget of ₹
                        {remainingBudget}.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleCreateMilestone}
                      disabled={remainingBudget < newMilestone.amount}
                    >
                      Create Milestone
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No milestones created yet.</p>
            {isCustomer && (
              <p className="text-sm">
                Break down larger tasks into milestones for better project
                management.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <Badge className={getStatusColor(milestone.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(milestone.status)}
                          <span className="capitalize">
                            {milestone.status.replace("_", " ")}
                          </span>
                        </div>
                      </Badge>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {milestone.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-semibold text-primary">
                        ₹{milestone.amount}
                      </span>
                      {milestone.dueDate && (
                        <span className="text-muted-foreground">
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Tasker Actions */}
                    {isTasker && milestone.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleStartMilestone(milestone.id)}
                      >
                        Start
                      </Button>
                    )}

                    {isTasker && milestone.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteMilestone(milestone.id)}
                      >
                        Mark Complete
                      </Button>
                    )}

                    {/* Customer Actions */}
                    {isCustomer && milestone.status === "completed" && (
                      <Button
                        size="sm"
                        onClick={() => handlePayMilestone(milestone.id)}
                      >
                        <IndianRupee className="w-4 h-4 mr-1" />
                        Pay
                      </Button>
                    )}

                    {isCustomer && milestone.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMilestone(milestone.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Budget Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">₹{totalMilestoneAmount}</div>
                  <div className="text-muted-foreground">Allocated</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    ₹
                    {milestones
                      .filter((m) => m.status === "paid")
                      .reduce((sum, m) => sum + m.amount, 0)}
                  </div>
                  <div className="text-muted-foreground">Paid</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">₹{remainingBudget}</div>
                  <div className="text-muted-foreground">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
