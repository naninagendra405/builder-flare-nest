import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Shield,
  AlertTriangle,
  CreditCard,
  Award,
  Users,
} from "lucide-react";
import type { Task } from "../contexts/TaskContext";

interface TaskWorkflowProps {
  task: Task;
}

export default function TaskWorkflow({ task }: TaskWorkflowProps) {
  const { user } = useAuth();
  const { approveTaskAndHoldEscrow, markTaskCompleted, releasePayment } =
    useTasks();
  const { addNotification } = useNotifications();
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  if (!user) return null;

  const isCustomer = user.id === task.customerId;
  const isTasker = user.id === task.assignedTaskerId;

  const handleApproveTask = () => {
    approveTaskAndHoldEscrow(task.id);

    // Notify tasker
    addNotification({
      type: "task_update",
      title: "Task Approved!",
      message: `"${task.title}" has been approved by the customer. Payment is now held in escrow. You can start working!`,
      priority: "high",
      taskId: task.id,
      fromUser: user.name,
    });

    setShowApprovalDialog(false);
  };

  const handleMarkCompleted = () => {
    markTaskCompleted(task.id, user.id, user.role as "customer" | "tasker");

    const otherUserRole = user.role === "customer" ? "tasker" : "customer";
    const otherUserName =
      user.role === "customer" ? task.assignedTaskerName : task.customerName;

    addNotification({
      type: "task_update",
      title: "Task Completion Marked",
      message: `"${task.title}" has been marked as completed by the ${user.role}. Waiting for ${otherUserRole} confirmation.`,
      priority: "high",
      taskId: task.id,
      fromUser: user.name,
    });
  };

  const handleReleasePayment = () => {
    releasePayment(task.id);

    addNotification({
      type: "payment",
      title: "Payment Released!",
      message: `Payment of ₹${task.taskerPayment} has been released to ${task.assignedTaskerName} for "${task.title}".`,
      priority: "high",
      taskId: task.id,
      fromUser: "TaskIt System",
    });
  };

  const getStatusInfo = () => {
    switch (task.status) {
      case "bid_accepted":
        return {
          title: "Bid Accepted - Awaiting Customer Approval",
          description: isCustomer
            ? "Your task bid has been accepted. Please approve to start work and hold payment in escrow."
            : "Your bid has been accepted! Waiting for customer approval to start work.",
          color: "bg-blue-100 text-blue-800",
          icon: <Clock className="w-5 h-5" />,
        };
      case "approved":
        return {
          title: "Task Approved - Payment in Escrow",
          description: isCustomer
            ? `₹${task.escrowAmount} is held in escrow. Work is in progress.`
            : "Customer approved! Payment is secured in escrow. You can start working.",
          color: "bg-green-100 text-green-800",
          icon: <Shield className="w-5 h-5" />,
        };
      case "in_progress":
        return {
          title: "Work in Progress",
          description:
            "Task is being worked on. Mark as completed when finished.",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="w-5 h-5" />,
        };
      case "completed":
        return {
          title: "Task Completed",
          description: task.paymentReleased
            ? "Task completed and payment released!"
            : "Task completed! Processing payment release.",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            {statusInfo.icon}
            <CardTitle className="text-lg">{statusInfo.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Badge className={`${statusInfo.color} mb-4`} variant="secondary">
            {task.status.replace("_", " ").toUpperCase()}
          </Badge>
          <p className="text-muted-foreground mb-4">{statusInfo.description}</p>

          {/* Task Approval Section - Customer Only */}
          {task.status === "bid_accepted" && isCustomer && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Approve this task to start work and hold ₹{task.budget} in
                  escrow for secure payment.
                </AlertDescription>
              </Alert>

              <Dialog
                open={showApprovalDialog}
                onOpenChange={setShowApprovalDialog}
              >
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Approve Task & Hold Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Task & Escrow Payment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <CreditCard className="h-4 w-4" />
                      <AlertDescription>
                        ₹{task.budget} will be debited from your account and
                        held securely in escrow until task completion.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Task Amount:</span>
                        <span className="font-semibold">₹{task.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee (10%):</span>
                        <span className="font-semibold">
                          ₹{Math.round(task.budget * 0.1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasker Payment:</span>
                        <span className="font-semibold">
                          ₹{Math.round(task.budget * 0.9)}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowApprovalDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button className="flex-1" onClick={handleApproveTask}>
                        Approve & Hold Payment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Escrow Information */}
          {task.escrowStatus === "held" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">
                  Payment Secured
                </h4>
              </div>
              <div className="space-y-1 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Amount in Escrow:</span>
                  <span className="font-semibold">₹{task.escrowAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasker will receive:</span>
                  <span className="font-semibold">₹{task.taskerPayment}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform commission:</span>
                  <span className="font-semibold">₹{task.adminCommission}</span>
                </div>
              </div>
            </div>
          )}

          {/* Completion Tracking */}
          {(task.status === "approved" || task.status === "in_progress") && (
            <div className="space-y-4">
              <h4 className="font-semibold">Task Completion</h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Customer Completion</span>
                  </div>
                  {task.customerCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Tasker Completion</span>
                  </div>
                  {task.taskerCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              </div>

              {/* Mark Completed Button */}
              {((isCustomer && !task.customerCompleted) ||
                (isTasker && !task.taskerCompleted)) && (
                <Button
                  onClick={handleMarkCompleted}
                  className="w-full"
                  disabled={
                    task.status === "completed" ||
                    (isCustomer && task.customerCompleted) ||
                    (isTasker && task.taskerCompleted)
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
            </div>
          )}

          {/* Payment Release - Admin or Automatic */}
          {task.status === "completed" && !task.paymentReleased && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Task completed by both parties! Payment will be released
                  automatically.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleReleasePayment}
                className="w-full"
                variant="default"
              >
                <IndianRupee className="w-4 h-4 mr-2" />
                Release Payment (₹{task.taskerPayment})
              </Button>
            </div>
          )}

          {/* Payment Released Confirmation */}
          {task.paymentReleased && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Payment of ₹{task.taskerPayment} has been successfully released
                to {task.assignedTaskerName}!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
