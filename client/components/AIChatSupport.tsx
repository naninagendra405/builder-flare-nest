import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  Bot,
  X,
  HelpCircle,
  CreditCard,
  Shield,
  Users,
  Briefcase,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  text: string;
  category: string;
  icon: any;
}

const quickActions: QuickAction[] = [
  {
    id: "payment-help",
    text: "Help with payment",
    category: "Payment",
    icon: CreditCard,
  },
  {
    id: "account-security",
    text: "Account security",
    category: "Security",
    icon: Shield,
  },
  {
    id: "how-to-post",
    text: "How to post a task",
    category: "Getting Started",
    icon: Briefcase,
  },
  {
    id: "find-taskers",
    text: "Finding taskers",
    category: "Getting Started",
    icon: Users,
  },
  {
    id: "dispute-help",
    text: "Dispute resolution",
    category: "Support",
    icon: HelpCircle,
  },
];

const aiResponses: Record<string, string> = {
  "payment-help": `I can help you with payment issues! Here are the most common solutions:

• **Payment not processing**: Check your payment method is up to date
• **Refund requests**: Go to Wallet > Transactions to request a refund  
• **Escrow questions**: Funds are held safely until task completion
• **Payment methods**: Add/update cards in Wallet > Payment Methods

Would you like me to guide you through any of these steps?`,

  "account-security": `Your account security is important! Here's how to stay protected:

• **Two-factor authentication**: Enable in Profile > Settings > Security
• **Strong passwords**: Use unique passwords with 8+ characters
• **Verify identity**: Complete identity verification for better trust
• **Report suspicious activity**: Contact us immediately if something seems wrong

Need help setting up any security features?`,

  "how-to-post": `Posting a task is easy! Here's the step-by-step process:

1. **Click "Post New Task"** from your dashboard
2. **Fill in details**: Title, description, and category
3. **Set your budget**: Use our AI pricing suggestions
4. **Add location**: Physical address or mark as remote
5. **Review and publish**: Your task will be live immediately!

Tips for better results:
• Be specific in your description
• Set a fair budget 
• Include photos if helpful
• Respond quickly to bids

Ready to post your first task?`,

  "find-taskers": `Finding the right tasker is key to success! Here's how:

• **Browse profiles**: Check ratings, reviews, and completed tasks
• **Review bids carefully**: Look at price, timeline, and message quality
• **Check verification**: Verified taskers have completed background checks
• **Read reviews**: See what other customers say
• **Message before hiring**: Ask questions to ensure good fit

Our matching algorithm also suggests taskers based on:
- Location proximity
- Skill match
- Availability
- Past performance

Want help evaluating a specific tasker?`,

  "dispute-help": `If you're having an issue with a task, I'm here to help resolve it:

**For Customers:**
• Contact the tasker first to discuss the issue
• If unresolved, file a dispute in the task details
• Provide photos/evidence of the problem
• Our team will review within 24 hours

**For Taskers:**  
• Communicate clearly about any challenges
• Provide progress updates to customers
• If there's a disagreement, respond to disputes quickly
• Document your work with photos

**Common resolutions:**
- Partial refunds for incomplete work
- Additional time to complete tasks  
- Mediated agreements between parties

Need help filing a dispute or want to discuss a specific situation?`,

  general: `Hi! I'm your AI assistant for TaskIt. I can help you with:

🏠 **Getting Started**: How to post tasks or find work
💳 **Payments**: Billing, refunds, and escrow questions  
🔒 **Security**: Account protection and verification
👥 **Finding Help**: Choosing taskers and managing tasks
⚖️ **Disputes**: Resolving issues between parties

Just type your question or select a topic above. I'm here 24/7 to help make your TaskIt experience smooth!`,
};

export default function AIChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      content: aiResponses["general"],
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = (content: string, isQuickAction = false) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    let aiResponse = "";
    if (isQuickAction) {
      const action = quickActions.find((a) => a.text === content);
      aiResponse = aiResponses[action?.id || "general"];
    } else {
      // Simple keyword matching for responses
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes("payment") || lowerContent.includes("money")) {
        aiResponse = aiResponses["payment-help"];
      } else if (
        lowerContent.includes("security") ||
        lowerContent.includes("password")
      ) {
        aiResponse = aiResponses["account-security"];
      } else if (
        lowerContent.includes("post") ||
        lowerContent.includes("task") ||
        lowerContent.includes("create")
      ) {
        aiResponse = aiResponses["how-to-post"];
      } else if (
        lowerContent.includes("tasker") ||
        lowerContent.includes("find") ||
        lowerContent.includes("hire")
      ) {
        aiResponse = aiResponses["find-taskers"];
      } else if (
        lowerContent.includes("dispute") ||
        lowerContent.includes("problem") ||
        lowerContent.includes("issue")
      ) {
        aiResponse = aiResponses["dispute-help"];
      } else {
        aiResponse = `I understand you're asking about "${content}". While I can help with common TaskIt questions, for specific issues you might want to contact our human support team.

Here are some things I can definitely help with:
• Payment and billing questions
• Account security setup  
• How to post tasks or find taskers
• Understanding our platform features

Try asking about any of these topics, or click one of the quick actions above!`;
      }
    }

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInputMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
          size="icon"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>AI Support</span>
            <Badge variant="secondary" className="ml-auto">
              Online
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Quick Actions */}
        <div className="p-4 border-b bg-muted/30">
          <p className="text-sm text-muted-foreground mb-3">Quick help with:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 3).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(action.text, true)}
                  className="text-xs"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {action.text}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
