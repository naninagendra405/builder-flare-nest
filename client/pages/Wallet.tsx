import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
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
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  Upload,
  MoreHorizontal,
  Wallet as WalletIcon,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Shield,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    type: "credit",
    amount: 500,
    description: "Payment from John Smith",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "txn_2",
    type: "debit",
    amount: 75,
    description: "Task: Fix kitchen sink",
    date: "2024-01-14T15:45:00Z",
    status: "completed",
  },
  {
    id: "txn_3",
    type: "credit",
    amount: 250,
    description: "Added funds via Credit Card",
    date: "2024-01-13T09:20:00Z",
    status: "completed",
  },
  {
    id: "txn_4",
    type: "debit",
    amount: 125,
    description: "Withdrawn to bank account",
    date: "2024-01-12T14:10:00Z",
    status: "completed",
  },
];

export default function Wallet() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [balance, setBalance] = useState(1247.5);
  const [escrowBalance] = useState(325.0);
  const [pendingBalance] = useState(75.0);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  if (!user) {
    navigate("/login");
    return null;
  }

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
    if (!addAmount || parseFloat(addAmount) <= 0) {
      addNotification({
        type: "system",
        title: "Invalid Amount",
        message: "Please enter a valid amount greater than 0.",
        priority: "medium",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const amount = parseFloat(addAmount);

      // Update balance in state
      setBalance((prev) => prev + amount);

      // Add transaction record
      const newTransaction = {
        id: `txn_${Date.now()}`,
        type: "credit" as const,
        amount: amount,
        description: `Added funds via payment method`,
        date: new Date().toISOString(),
        status: "completed" as const,
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      addNotification({
        type: "payment",
        title: "Funds Added Successfully",
        message: `₹${addAmount} has been added to your wallet.`,
        priority: "high",
      });

      setShowAddFunds(false);
      setAddAmount("");
    } catch (error) {
      addNotification({
        type: "system",
        title: "Payment Failed",
        message: "Failed to add funds. Please try again.",
        priority: "high",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      addNotification({
        type: "system",
        title: "Invalid Amount",
        message: "Please enter a valid amount greater than 0.",
        priority: "medium",
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > balance) {
      addNotification({
        type: "error",
        title: "Insufficient Funds",
        message: `You only have ₹${balance.toFixed(2)} available in your wallet.`,
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate withdrawal processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update balance in state
      setBalance((prev) => prev - amount);

      // Add transaction record
      const newTransaction = {
        id: `txn_${Date.now()}`,
        type: "debit" as const,
        amount: amount,
        description: "Funds withdrawn to bank account",
        date: new Date().toISOString(),
        status: "completed" as const,
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      addNotification({
        type: "payment",
        title: "Withdrawal Successful",
        message: `₹${withdrawAmount} has been withdrawn from your wallet.`,
      });

      setShowWithdraw(false);
      setWithdrawAmount("");
    } catch (error) {
      addNotification({
        type: "error",
        title: "Withdrawal Failed",
        message: "Failed to process withdrawal. Please try again.",
      });
    } finally {
      setIsProcessing(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Enhanced Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <WalletIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Wallet
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your funds securely
                  </p>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export Transactions
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Shield className="w-4 h-4 mr-2" />
                  Security Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Balance Cards - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Main Balance */}
          <Card className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white/90 text-sm font-medium">
                  Available Balance
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8"
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold mb-4">
                {showBalance ? `₹${balance.toFixed(2)}` : "₹****"}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Funds
                    </Button>
                  </DialogTrigger>
                </Dialog>
                <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 border-white/30 text-white hover:bg-white/20"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Escrow
                    </p>
                    <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                      ₹{escrowBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Pending
                    </p>
                    <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      ₹{pendingBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm" className="text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {transactions.slice(0, 6).map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    index !== transactions.length - 1
                      ? "border-b border-gray-100 dark:border-gray-800"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getTimeAgo(transaction.date)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "credit"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Funds Dialog */}
        <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Add Funds to Wallet
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Current Balance
                  </p>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ₹{balance.toFixed(2)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="addAmount" className="text-sm font-medium">
                    Amount to Add
                  </Label>
                  <div className="relative mt-1">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="addAmount"
                      type="number"
                      placeholder="0.00"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="pl-10 text-lg h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAddAmount(amount.toString())}
                      className="text-sm"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddFunds(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleAddFunds}
                  disabled={!addAmount || isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    `Add ₹${addAmount || "0.00"}`
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Withdraw Dialog */}
        <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Download className="w-5 h-5 mr-2 text-red-600" />
                Withdraw Funds
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Available Balance
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="withdrawAmount"
                    className="text-sm font-medium"
                  >
                    Amount to Withdraw
                  </Label>
                  <div className="relative mt-1">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="withdrawAmount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="pl-10 text-lg h-12"
                      max={balance}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Available: ₹{balance.toFixed(2)}
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Processing Time
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Withdrawals typically take 1-3 business days to process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowWithdraw(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    `Withdraw ₹${withdrawAmount || "0.00"}`
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
