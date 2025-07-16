import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  Camera,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  Edit,
  Save,
  X,
  Plus,
  Award,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Zap,
  Bell,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  taskTitle: string;
  date: string;
  type: "received" | "given";
}

interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "expert";
  verified: boolean;
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  image: string;
  completedAt: string;
  category: string;
}

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Experienced handyman with 10+ years in home repair and maintenance. Specializing in plumbing, electrical, and general repairs.",
    website: "https://johnsmith.com",
    hourlyRate: "45",
    availability: "weekdays",
    languages: ["English", "Spanish"],
    skills: [
      { name: "Plumbing", level: "expert", verified: true },
      { name: "Electrical", level: "intermediate", verified: true },
      { name: "Carpentry", level: "expert", verified: false },
      { name: "Painting", level: "intermediate", verified: false },
    ] as Skill[],
    portfolio: [
      {
        id: "1",
        title: "Kitchen Renovation",
        description:
          "Complete kitchen renovation including plumbing and electrical work",
        image: "/placeholder.svg",
        completedAt: "2024-01-10",
        category: "Home Repair",
      },
      {
        id: "2",
        title: "Bathroom Repair",
        description: "Fixed multiple plumbing issues and tile replacement",
        image: "/placeholder.svg",
        completedAt: "2024-01-05",
        category: "Home Repair",
      },
    ] as Portfolio[],
  });

  const [notifications, setNotifications] = useState({
    emailOffers: true,
    emailMessages: true,
    emailUpdates: false,
    pushOffers: true,
    pushMessages: true,
    pushUpdates: true,
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const reviews: Review[] = [
    {
      id: "1",
      rating: 5,
      comment:
        "Excellent work! Fixed my sink quickly and professionally. Highly recommend!",
      reviewerName: "Sarah Johnson",
      taskTitle: "Fix kitchen sink leak",
      date: "2024-01-15",
      type: "received",
    },
    {
      id: "2",
      rating: 4,
      comment:
        "Good quality work, arrived on time. Very satisfied with the results.",
      reviewerName: "Mike Wilson",
      taskTitle: "Bathroom repair",
      date: "2024-01-10",
      type: "received",
    },
    {
      id: "3",
      rating: 5,
      comment: "Great communication and fair pricing. Will hire again!",
      reviewerName: "Emily Davis",
      taskTitle: "Help with moving",
      date: "2024-01-08",
      type: "given",
    },
  ];

  const stats = [
    { label: "Tasks Completed", value: "127", icon: CheckCircle },
    { label: "Average Rating", value: "4.9", icon: Star },
    { label: "Response Time", value: "< 1hr", icon: Clock },
    { label: "Success Rate", value: "98%", icon: Award },
  ];

  const updateProfile = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillName: string) => {
    if (!profile.skills.find((s) => s.name === skillName)) {
      setProfile((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          { name: skillName, level: "beginner", verified: false },
        ],
      }));
    }
  };

  const removeSkill = (skillName: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  const handleSave = () => {
    // TODO: Save profile to backend
    setIsEditing(false);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "beginner":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            <div className="flex items-center space-x-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="text-3xl">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      className="text-3xl font-bold h-12"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                  )}
                  <Badge
                    variant={user.role === "tasker" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                  {user.verificationStatus === "verified" && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={profile.email}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      profile.email
                    )}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={profile.phone}
                        onChange={(e) => updateProfile("phone", e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      profile.phone
                    )}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={profile.location}
                        onChange={(e) =>
                          updateProfile("location", e.target.value)
                        }
                        className="h-8"
                      />
                    ) : (
                      profile.location
                    )}
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {isEditing ? (
                      <Input
                        value={profile.website}
                        onChange={(e) =>
                          updateProfile("website", e.target.value)
                        }
                        className="h-8"
                      />
                    ) : (
                      <a
                        href={profile.website}
                        className="text-primary hover:underline"
                      >
                        {profile.website}
                      </a>
                    )}
                  </div>
                </div>

                {user.role === "tasker" && (
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {isEditing ? (
                        <Input
                          value={profile.hourlyRate}
                          onChange={(e) =>
                            updateProfile("hourlyRate", e.target.value)
                          }
                          className="h-8 w-20"
                        />
                      ) : (
                        <span className="font-semibold">
                          ${profile.hourlyRate}/hr
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>4.9 (127 reviews)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <Label className="text-base font-semibold">About</Label>
              {isEditing ? (
                <Textarea
                  value={profile.bio}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              ) : (
                <p className="mt-2 text-muted-foreground">{profile.bio}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {user.role === "tasker" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Skills & Expertise
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="relative">
                      <Badge
                        className={`${getSkillLevelColor(skill.level)} pr-8`}
                        variant="secondary"
                      >
                        {skill.name} ({skill.level})
                        {skill.verified && (
                          <CheckCircle className="w-3 h-3 ml-1 inline" />
                        )}
                      </Badge>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill.name)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Identity Verification</div>
                        <div className="text-sm text-muted-foreground">
                          Government ID verified
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Phone Verification</div>
                        <div className="text-sm text-muted-foreground">
                          Phone number confirmed
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Email Verification</div>
                        <div className="text-sm text-muted-foreground">
                          Email address confirmed
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  {user.role === "tasker" && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 mr-3 text-yellow-500" />
                        <div>
                          <div className="font-medium">Background Check</div>
                          <div className="text-sm text-muted-foreground">
                            Criminal background verified
                          </div>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Credentials - Only for taskers */}
            {user.role === "tasker" && user.taskerProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Professional Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Service Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.taskerProfile.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="capitalize"
                        >
                          {category.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Experience Level</h4>
                      <Badge variant="secondary" className="capitalize">
                        {user.taskerProfile.experience}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Hourly Rate</h4>
                      <div className="text-lg font-semibold">
                        ${user.taskerProfile.hourlyRate}/hr
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Service Area</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.taskerProfile.serviceArea}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Availability</h4>
                      <Badge variant="outline" className="capitalize">
                        {user.taskerProfile.availability?.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Credentials */}
                  {user.taskerProfile.professionalCredentials &&
                    user.taskerProfile.professionalCredentials.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">
                          Licenses & Credentials
                        </h4>
                        <div className="space-y-3">
                          {user.taskerProfile.professionalCredentials.map(
                            (cred, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div>
                                  <div className="font-medium text-sm capitalize">
                                    {cred.type.replace("_", " ")}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {cred.description}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {cred.verified ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <Badge
                                        variant="default"
                                        className="text-xs"
                                      >
                                        Verified
                                      </Badge>
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Pending
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Certifications */}
                  {user.taskerProfile.certifications &&
                    user.taskerProfile.certifications.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">
                          Certifications & Training
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.taskerProfile.certifications.map(
                            (cert, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="flex items-center"
                              >
                                <Award className="w-3 h-3 mr-1" />
                                {cert}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Languages */}
                  {user.taskerProfile.languages &&
                    user.taskerProfile.languages.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.taskerProfile.languages.map((lang, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center"
                            >
                              <Globe className="w-3 h-3 mr-1" />
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Professional Bio */}
                  {user.taskerProfile.bio && (
                    <div>
                      <h4 className="font-medium mb-3">Professional Bio</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {user.taskerProfile.bio}
                      </p>
                    </div>
                  )}

                  {/* Trust Score */}
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Trust Score</h4>
                        <p className="text-sm text-muted-foreground">
                          Based on verification status and customer feedback
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {user.taskerProfile.professionalCredentials?.filter(
                            (c) => c.verified,
                          ).length *
                            20 +
                            60}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Verified Professional
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {review.reviewerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {review.reviewerName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {review.taskTitle}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge
                            variant={
                              review.type === "received"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {review.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {review.comment}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Portfolio
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {profile.portfolio.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="outline">{project.category}</Badge>
                          <span className="text-muted-foreground">
                            {new Date(project.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      Email notifications for new task offers
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Receive emails when customers invite you to bid
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailOffers}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        emailOffers: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      Push notifications for messages
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Get notified when you receive new messages
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushMessages}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        pushMessages: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly task updates</div>
                    <div className="text-sm text-muted-foreground">
                      Summary of new tasks matching your skills
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        emailUpdates: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Two-Factor Authentication
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
              </CardContent>
            </Card>

            {/* Account Management */}
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Deactivate Account
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPasswordDialog(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">Update Password</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
