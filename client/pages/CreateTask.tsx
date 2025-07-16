import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Camera,
  X,
  AlertCircle,
  CheckCircle,
  Zap,
  Home,
  Monitor,
  Wrench,
  Briefcase,
  Car,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAIPricingSuggestion } from "../utils/aiPricing";

interface TaskForm {
  title: string;
  description: string;
  category: string;
  budget: string;
  budgetType: "fixed" | "hourly";
  location: string;
  isRemote: boolean;
  deadline: string;
  timeEstimate: string;
  skillsRequired: string[];
  images: File[];
  urgency: "low" | "medium" | "high";
  instructions: string;
}

export default function CreateTask() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [aiPricingSuggestion, setAiPricingSuggestion] = useState<any>(null);
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    category: "",
    budget: "",
    budgetType: "fixed",
    location: "",
    isRemote: false,
    deadline: "",
    timeEstimate: "",
    skillsRequired: [],
    images: [],
    urgency: "medium",
    instructions: "",
  });

  if (!user || user.role !== "customer") {
    navigate("/dashboard");
    return null;
  }

  const categories = [
    {
      id: "home-repair",
      name: "Home Repair",
      icon: Home,
      color: "text-blue-600",
    },
    {
      id: "digital",
      name: "Digital Services",
      icon: Monitor,
      color: "text-purple-600",
    },
    {
      id: "emergency",
      name: "Emergency Help",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      id: "handyman",
      name: "Handyman",
      icon: Wrench,
      color: "text-orange-600",
    },
    {
      id: "business",
      name: "Business Services",
      icon: Briefcase,
      color: "text-green-600",
    },
    {
      id: "transport",
      name: "Transport & Moving",
      icon: Car,
      color: "text-yellow-600",
    },
    {
      id: "events",
      name: "Events & Personal",
      icon: Users,
      color: "text-pink-600",
    },
  ];

  const skillSuggestions = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Web Development",
    "Graphic Design",
    "Writing",
    "Photography",
    "Moving",
    "Assembly",
    "Landscaping",
    "Tutoring",
    "Cooking",
  ];

  const updateForm = (field: keyof TaskForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (!form.skillsRequired.includes(skill)) {
      updateForm("skillsRequired", [...form.skillsRequired, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    updateForm(
      "skillsRequired",
      form.skillsRequired.filter((s) => s !== skill),
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      updateForm("images", [...form.images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    updateForm(
      "images",
      form.images.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async () => {
    try {
      // TODO: Submit task to backend
      console.log("Submitting task:", form);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      alert("🎉 Task posted successfully! You'll start receiving bids soon.");

      // Navigate to tasks page to see the posted task
      navigate("/tasks");
    } catch (error) {
      alert("Failed to post task. Please try again.");
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return form.title && form.description && form.category;
      case 2:
        return form.budget && (form.isRemote || form.location);
      case 3:
        return true; // Optional step
      default:
        return true;
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

      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Post a New Task</h1>
          <p className="text-muted-foreground">
            Tell us what you need done and connect with skilled taskers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-colors duration-300 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    What do you need done?
                  </h2>
                  <p className="text-muted-foreground">
                    Give your task a clear title and description
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Fix my leaky kitchen sink"
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    className="text-lg h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what needs to be done, any specific requirements, and what the tasker should know..."
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Category *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => updateForm("category", category.id)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            form.category === category.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 mx-auto mb-2 ${category.color}`}
                          />
                          <div className="text-sm font-medium">
                            {category.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Urgency Level</Label>
                  <div className="flex space-x-3">
                    {[
                      {
                        value: "low",
                        label: "Low",
                        color: "border-green-200 text-green-700",
                      },
                      {
                        value: "medium",
                        label: "Medium",
                        color: "border-yellow-200 text-yellow-700",
                      },
                      {
                        value: "high",
                        label: "High",
                        color: "border-red-200 text-red-700",
                      },
                    ].map((urgency) => (
                      <button
                        key={urgency.value}
                        type="button"
                        onClick={() => updateForm("urgency", urgency.value)}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                          form.urgency === urgency.value
                            ? `${urgency.color} bg-opacity-10`
                            : "border-border"
                        }`}
                      >
                        {urgency.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Budget and Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Budget and Location
                  </h2>
                  <p className="text-muted-foreground">
                    Set your budget and specify where the work should be done
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="budget">Budget *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          id="budget"
                          type="number"
                          placeholder="0.00"
                          value={form.budget}
                          onChange={(e) => updateForm("budget", e.target.value)}
                          className="pl-12 text-lg h-12"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={form.budgetType}
                        onValueChange={(value) =>
                          updateForm("budgetType", value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="hourly">Per Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Tasks with clear, fair budgets
                      get more bids. Check similar tasks to see typical pricing.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Work Location</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="remote" className="text-sm">
                        Remote work
                      </Label>
                      <Switch
                        id="remote"
                        checked={form.isRemote}
                        onCheckedChange={(checked) =>
                          updateForm("isRemote", checked)
                        }
                      />
                    </div>
                  </div>

                  {!form.isRemote && (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        placeholder="Enter address or neighborhood"
                        value={form.location}
                        onChange={(e) => updateForm("location", e.target.value)}
                        className="pl-12"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline (Optional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={(e) => updateForm("deadline", e.target.value)}
                        className="pl-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeEstimate">Estimated Duration</Label>
                    <Select
                      value={form.timeEstimate}
                      onValueChange={(value) =>
                        updateForm("timeEstimate", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How long will this take?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2-hours">1-2 hours</SelectItem>
                        <SelectItem value="half-day">
                          Half day (3-4 hours)
                        </SelectItem>
                        <SelectItem value="full-day">
                          Full day (6-8 hours)
                        </SelectItem>
                        <SelectItem value="2-3-days">2-3 days</SelectItem>
                        <SelectItem value="1-week">1 week</SelectItem>
                        <SelectItem value="2-weeks">2+ weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Additional Details
                  </h2>
                  <p className="text-muted-foreground">
                    Add photos, specify skills, and provide any special
                    instructions
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Required Skills (Optional)</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.skillsRequired.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillSuggestions
                      .filter((skill) => !form.skillsRequired.includes(skill))
                      .slice(0, 8)
                      .map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="px-3 py-1 text-sm border rounded-full hover:bg-muted transition-colors"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Add photos to help taskers understand your task better
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      Upload Images
                    </Button>
                  </div>
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {form.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any specific tools to bring, access instructions, or other important details..."
                    value={form.instructions}
                    onChange={(e) => updateForm("instructions", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Save Draft
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!isStepValid(currentStep)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid(currentStep)}
                    className="bg-primary"
                  >
                    Post Task
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        {form.title && (
          <Card className="mt-6 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Task Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{form.title}</h3>
                {form.description && (
                  <p className="text-muted-foreground">{form.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {form.category && (
                    <Badge variant="outline">
                      {categories.find((c) => c.id === form.category)?.name}
                    </Badge>
                  )}
                  {form.budget && (
                    <Badge variant="secondary">
                      ${form.budget}{" "}
                      {form.budgetType === "hourly" ? "/hour" : "fixed"}
                    </Badge>
                  )}
                  {form.urgency && (
                    <Badge
                      className={
                        form.urgency === "high"
                          ? "bg-red-100 text-red-800"
                          : form.urgency === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {form.urgency} priority
                    </Badge>
                  )}
                </div>
                {(form.location || form.isRemote) && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {form.isRemote ? "Remote work" : form.location}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
