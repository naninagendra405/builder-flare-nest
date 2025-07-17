import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  CheckCircle,
  Clock,
  Upload,
  Phone,
  Mail,
  CreditCard,
  AlertTriangle,
  FileText,
  Camera,
  UserCheck,
} from "lucide-react";

interface VerificationStatus {
  phone: boolean;
  email: boolean;
  identity: boolean;
  payment: boolean;
  address: boolean;
  background: boolean;
}

interface VerificationBadgeProps {
  isVerified: boolean;
  type: string;
}

function VerificationBadge({ isVerified, type }: VerificationBadgeProps) {
  return (
    <Badge
      variant={isVerified ? "default" : "secondary"}
      className={
        isVerified
          ? "bg-green-100 text-green-800 border-green-300"
          : "bg-gray-100 text-gray-600"
      }
    >
      {isVerified ? (
        <CheckCircle className="w-3 h-3 mr-1" />
      ) : (
        <Clock className="w-3 h-3 mr-1" />
      )}
      {type}
    </Badge>
  );
}

export default function VerificationSystem() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock verification status - in real app, this would come from user context
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>({
      phone: user?.phoneVerified || false,
      email: user?.emailVerified || true, // Usually verified during signup
      identity: false,
      payment: false,
      address: false,
      background: false,
    });

  if (!user) return null;

  const getVerificationLevel = () => {
    const verifiedCount =
      Object.values(verificationStatus).filter(Boolean).length;
    const totalVerifications = Object.keys(verificationStatus).length;
    const percentage = (verifiedCount / totalVerifications) * 100;

    if (percentage >= 100) return { level: "Fully Verified", color: "green" };
    if (percentage >= 66) return { level: "Highly Verified", color: "blue" };
    if (percentage >= 33)
      return { level: "Partially Verified", color: "yellow" };
    return { level: "Unverified", color: "red" };
  };

  const handleStartVerification = (step: string) => {
    setVerificationStep(step);
    setShowVerificationDialog(true);
  };

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call for verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update verification status
      setVerificationStatus({
        ...verificationStatus,
        [verificationStep]: true,
      });

      addNotification({
        type: "success",
        title: "Verification Submitted",
        message: `Your ${verificationStep} verification has been submitted and is under review.`,
        priority: "medium",
        fromUser: "TaskIt System",
      });

      setShowVerificationDialog(false);
      setVerificationStep("");
    } catch (error) {
      addNotification({
        type: "error",
        title: "Verification Failed",
        message: "Failed to submit verification. Please try again.",
        priority: "medium",
        fromUser: "TaskIt System",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificationLevel = getVerificationLevel();
  const isFullyVerified = Object.values(verificationStatus).every(Boolean);

  const verificationSteps = [
    {
      key: "phone",
      title: "Phone Number",
      description: "Verify your phone number with SMS",
      icon: <Phone className="w-5 h-5" />,
      required: true,
    },
    {
      key: "email",
      title: "Email Address",
      description: "Confirm your email address",
      icon: <Mail className="w-5 h-5" />,
      required: true,
    },
    {
      key: "identity",
      title: "Identity Document",
      description: "Upload government-issued ID",
      icon: <FileText className="w-5 h-5" />,
      required: true,
    },
    {
      key: "payment",
      title: "Payment Method",
      description: "Add and verify a payment method",
      icon: <CreditCard className="w-5 h-5" />,
      required: true,
    },
    {
      key: "address",
      title: "Address Verification",
      description: "Verify your physical address",
      icon: <Camera className="w-5 h-5" />,
      required: false,
    },
    {
      key: "background",
      title: "Background Check",
      description: "Complete background verification",
      icon: <Shield className="w-5 h-5" />,
      required: user?.role === "tasker",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>Account Verification</span>
          </CardTitle>
          <Badge
            variant="outline"
            className={`border-${verificationLevel.color}-300 text-${verificationLevel.color}-700`}
          >
            {verificationLevel.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Verification Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Verification Progress</span>
              <span className="text-sm text-muted-foreground">
                {Object.values(verificationStatus).filter(Boolean).length}/
                {Object.keys(verificationStatus).length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-${verificationLevel.color}-500 h-2 rounded-full transition-all duration-300`}
                style={{
                  width: `${(Object.values(verificationStatus).filter(Boolean).length / Object.keys(verificationStatus).length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Benefits Alert */}
          {!isFullyVerified && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Complete all verifications to access premium features, higher
                task limits, and build more trust with other users.
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Steps */}
          <div className="space-y-3">
            {verificationSteps.map((step) => (
              <div
                key={step.key}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      verificationStatus[step.key as keyof VerificationStatus]
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{step.title}</h4>
                      {step.required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <VerificationBadge
                    isVerified={
                      verificationStatus[step.key as keyof VerificationStatus]
                    }
                    type={
                      verificationStatus[step.key as keyof VerificationStatus]
                        ? "Verified"
                        : "Pending"
                    }
                  />
                  {!verificationStatus[
                    step.key as keyof VerificationStatus
                  ] && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartVerification(step.key)}
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Full Verification Badge */}
          {isFullyVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">
                  Fully Verified Account
                </h4>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your account is fully verified. You have access to all platform
                features and maximum trust rating.
              </p>
            </div>
          )}
        </div>

        {/* Verification Dialog */}
        <Dialog
          open={showVerificationDialog}
          onOpenChange={setShowVerificationDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Verify{" "}
                {
                  verificationSteps.find((s) => s.key === verificationStep)
                    ?.title
                }
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {verificationStep === "phone" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      defaultValue={user.phone || ""}
                    />
                  </div>
                  <Button
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Sending SMS..." : "Send Verification SMS"}
                  </Button>
                </div>
              )}

              {verificationStep === "identity" && (
                <div className="space-y-4">
                  <div>
                    <Label>Upload Government ID</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Upload passport, driver's license, or national ID
                      </p>
                      <Button size="sm" className="mt-2">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Uploading..." : "Submit Document"}
                  </Button>
                </div>
              )}

              {verificationStep === "payment" && (
                <div className="space-y-4">
                  <Alert>
                    <CreditCard className="h-4 w-4" />
                    <AlertDescription>
                      Add a payment method to enable secure transactions. We'll
                      verify with a small temporary charge.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Processing..." : "Add Payment Method"}
                  </Button>
                </div>
              )}

              {verificationStep === "background" && (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Background check includes criminal history and identity
                      verification. This helps build trust with customers.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Processing..." : "Start Background Check"}
                  </Button>
                </div>
              )}

              {(verificationStep === "email" ||
                verificationStep === "address") && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This verification step will be processed automatically.
                  </p>
                  <Button
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Processing..." : "Start Verification"}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
