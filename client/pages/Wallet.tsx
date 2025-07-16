import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Plus,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  MoreHorizontal,
  Wallet as WalletIcon,
  Shield,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  type:
    | "payment"
    | "deposit"
    | "withdrawal"
    | "escrow_hold"
    | "escrow_release"
    | "refund";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: string;
  taskId?: string;
  taskTitle?: string;
  counterparty?: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  name: string;
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export default function Wallet() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance] = useState(1247.5);
  const [escrowBalance] = useState(325.0);
  const [pendingBalance] = useState(75.0);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "escrow_release",
      amount: 75.0,
      description: "Payment released for kitchen sink repair",
      status: "completed",
      date: "2024-01-15",
      taskId: "task_123",
      taskTitle: "Fix kitchen sink leak",
      counterparty: "John Smith",
    },
    {
      id: "2",
      type: "escrow_hold",
      amount: -120.0,
      description: "Funds held in escrow for moving help",
      status: "pending",
      date: "2024-01-14",
      taskId: "task_124",
      taskTitle: "Help with moving",
      counterparty: "Sarah Johnson",
    },
    {
      id: "3",
      type: "deposit",
      amount: 200.0,
      description: "Added funds via Credit Card ****1234",
      status: "completed",
      date: "2024-01-13",
    },
    {
      id: "4",
      type: "payment",
      amount: -45.0,
      description: "Payment for logo design work",
      status: "completed",
      date: "2024-01-12",
      taskId: "task_122",
      taskTitle: "Logo design for startup",
      counterparty: "Mike Wilson",
    },
    {
      id: "5",
      type: "withdrawal",
      amount: -150.0,
      description: "Withdrawal to Bank Account ****5678",
      status: "completed",
      date: "2024-01-11",
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "1",
      type: "card",
      name: "Visa ending in 1234",
      last4: "1234",
      expiryDate: "12/26",
      isDefault: true,
    },
    {
      id: "2",
      type: "bank",
      name: "Chase Bank ****5678",
      last4: "5678",
      isDefault: false,
    },
    {
      id: "3",
      type: "paypal",
      name: "PayPal Account",
      isDefault: false,
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "withdrawal":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "escrow_hold":
        return <Shield className="w-4 h-4 text-yellow-600" />;
      case "escrow_release":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case "refund":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = amount >= 0 ? "+" : "";
    const color = amount >= 0 ? "text-green-600" : "text-red-600";
    return (
      <span className={color}>
        {sign}₹{Math.abs(amount).toFixed(2)}
      </span>
    );
  };

  const handleAddFunds = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) return;

    setIsProcessing(true);
    try {
      // TODO: Call actual payment processing API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Adding funds:", {
        amount: parseFloat(addAmount),
        paymentMethod: selectedPaymentMethod,
      });

      // Mock success
      alert(`Successfully added ₹${addAmount} to your wallet!`);
      setShowAddFunds(false);
      setAddAmount("");
    } catch (error) {
      alert("Failed to add funds. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    if (parseFloat(withdrawAmount) > balance) {
      alert("Insufficient funds");
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Call actual withdrawal API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Withdrawing funds:", {
        amount: parseFloat(withdrawAmount),
      });

      // Mock success
      alert(`Successfully withdrew ₹${withdrawAmount}!`);
      setShowWithdraw(false);
      setWithdrawAmount("");
    } catch (error) {
      alert("Failed to withdraw funds. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
            <WalletIcon className="w-8 h-8 mr-3 text-primary" />
            Wallet
          </h1>
          <p className="text-muted-foreground">
            Manage your funds and transactions
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <WalletIcon className="w-5 h-5 mr-2 text-primary" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                ₹{balance.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Ready to use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-yellow-600" />
                In Escrow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                ${escrowBalance.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Held for active tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ${pendingBalance.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Funds to Wallet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <div className="space-y-2 mt-2">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedPaymentMethod === method.id
                            ? "border-primary bg-primary/10"
                            : ""
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          className="sr-only"
                        />
                        <CreditCard className="w-4 h-4" />
                        <span>{method.name}</span>
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Processing Time:</strong> Funds are typically
                    available within 1-2 business days.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleAddFunds}
                  disabled={
                    !addAmount || parseFloat(addAmount) <= 0 || isProcessing
                  }
                >
                  {isProcessing
                    ? "Processing..."
                    : `Add ₹${addAmount || "0.00"}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <TrendingDown className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Available: ${balance.toFixed(2)}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Withdrawal Processing:</strong> Funds will be
                    transferred to your default payment method within 3-5
                    business days.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={handleWithdraw}
                  disabled={
                    !withdrawAmount ||
                    parseFloat(withdrawAmount) <= 0 ||
                    parseFloat(withdrawAmount) > balance ||
                    isProcessing
                  }
                >
                  {isProcessing
                    ? "Processing..."
                    : `Withdraw ₹${withdrawAmount || "0.00"}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild>
            <Link to="/payment-methods">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Methods
            </Link>
          </Button>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transaction History</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3 sm:space-y-0"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{transaction.description}</h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        {transaction.counterparty && (
                          <span>• {transaction.counterparty}</span>
                        )}
                        {transaction.taskTitle && (
                          <span className="hidden sm:inline">
                            • {transaction.taskTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center text-left sm:text-right">
                    <div className="text-lg font-semibold">
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                    <Badge
                      className={`mt-0 sm:mt-1 ${getStatusColor(transaction.status)}`}
                      variant="secondary"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-8 border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-accent mb-2">
                  Your Money is Protected
                </h3>
                <p className="text-sm text-muted-foreground">
                  All transactions are secured with bank-level encryption. Funds
                  are held in escrow until task completion is confirmed by both
                  parties. TaskIt never has access to your payment information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
