import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  Home,
  Shield,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to task feed with search query
      navigate(`/tasks?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // If no search query, just go to tasks page
      navigate("/tasks");
    }
  };

  const handleQuickSearch = (category: string) => {
    navigate(`/tasks?category=${encodeURIComponent(category)}`);
  };

  const featuredTasks = [
    {
      id: 1,
      title: "Fix my kitchen sink",
      category: "Home Repair",
      budget: "₹6,250",
      location: "Manhattan, NY",
      time: "2 hours ago",
      bids: 12,
      rating: 4.9,
    },
    {
      id: 2,
      title: "Logo design for startup",
      category: "Digital Services",
      budget: "₹20,833",
      location: "Remote",
      time: "1 hour ago",
      bids: 8,
      rating: 4.8,
    },
    {
      id: 3,
      title: "Help moving furniture",
      category: "Emergency Help",
      budget: "₹10,000",
      location: "Brooklyn, NY",
      time: "30 min ago",
      bids: 5,
      rating: 4.7,
    },
  ];

  const stats = [
    { label: "Active Tasks", value: "12,847", icon: TrendingUp },
    { label: "Completed Jobs", value: "98,234", icon: CheckCircle },
    { label: "Happy Customers", value: "45,678", icon: Users },
    { label: "Average Rating", value: "4.9/5", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fb7fcb38896684c25a67a71f6b5b0365e%2F81896caa38e7430aac41e48cb8db0102?format=webp&width=800"
                  alt="TaskIt Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get Things Done,
            <br />
            The Smart Way
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with skilled taskers in your area or work remotely. Post
            tasks, get bids, and get quality work done quickly and securely.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="What do you need help with?"
                className="pl-12 pr-32 py-6 text-lg rounded-full border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
              >
                Search Tasks
              </Button>
            </div>
          </form>

          {/* Quick Search Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              "Home Repair",
              "Digital Services",
              "Moving Help",
              "Cleaning",
              "Tutoring",
            ].map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(category)}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/register?role=customer">I need something done</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link to="/register?role=tasker">I want to earn money</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tasks */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Recent Tasks</h2>
            <p className="text-xl text-muted-foreground">
              See what people are looking for help with right now
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredTasks.map((task) => (
              <Card
                key={task.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{task.category}</Badge>
                    <div className="text-2xl font-bold text-primary">
                      {task.budget}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {task.location}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {task.time}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {task.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {task.bids} bids
                      </span>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TaskIt?</h2>
            <p className="text-xl text-muted-foreground">
              The most trusted platform for getting things done
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure & Protected</h3>
              <p className="text-muted-foreground">
                Your payments are held in escrow until work is completed. Full
                protection for both parties.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Vetted Taskers</h3>
              <p className="text-muted-foreground">
                All taskers are background-checked and rated by the community
                for your peace of mind.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Payments</h3>
              <p className="text-muted-foreground">
                Simple, transparent pricing with multiple payment options. Pay
                only when satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fb7fcb38896684c25a67a71f6b5b0365e%2Fc94f508bd53e4adda6534f00e8c18f19?format=webp&width=800"
                    alt="TaskIt Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <p className="text-muted-foreground">
                The smartest way to get things done. Connect, collaborate, and
                complete tasks efficiently.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Safety
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TaskIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
