import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CreditCard,
  Plus,
  MoreHorizontal,
  Check,
  X,
  Shield,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
  verified: boolean;
}

export default function PaymentMethods() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa ending in 1234",
      last4: "1234",
      expiryDate: "12/26",
      isDefault: true,
      verified: true,
    },
    {
      id: "2",
      type: "bank",
      name: "Chase Bank ****5678",
      last4: "5678",
      isDefault: false,
      verified: true,
    },
    {
      id: "3",
      type: "paypal",
      name: "PayPal Account",
      isDefault: false,
      verified: false,
    },
  ]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const setAsDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
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
                onClick={() => navigate("/wallet")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fb7fcb38896684c25a67a71f6b5b0365e%2F81896caa38e7430aac41e48cb8db0102?format=webp&width=800"
                  alt="TaskIt Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-primary" />
            Payment Methods
          </h1>
          <p className="text-muted-foreground">
            Manage your payment methods for tasks and withdrawals
          </p>
        </div>

        {/* Add Payment Method */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Add New Payment Method</h3>
                <p className="text-sm text-muted-foreground">
                  Add a credit card, bank account, or PayPal
                </p>
              </div>
              <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Payment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">
                            Credit/Debit Card
                          </SelectItem>
                          <SelectItem value="bank">Bank Account</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <Button className="w-full">Add Payment Method</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={method.isDefault ? "border-primary" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {method.isDefault && (
                          <Badge variant="default">Default</Badge>
                        )}
                        {method.verified ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAsDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePaymentMethod(method.id)}
                      disabled={method.isDefault}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                {method.type === "card" && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Expires: {method.expiryDate}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="mt-8 border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-accent mb-2">
                  Your Payment Information is Secure
                </h3>
                <p className="text-sm text-muted-foreground">
                  All payment information is encrypted and securely stored. We
                  use industry-standard security measures to protect your
                  financial data. TaskIt never stores your full card numbers or
                  security codes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
