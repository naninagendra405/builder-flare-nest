import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Briefcase,
  CheckCircle,
  Plus,
  X,
  Upload,
  FileText,
  Shield,
  Award,
  Car,
  Wrench,
  Home,
  Laptop,
  Camera,
  Truck,
  Heart,
  BookOpen,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface TaskerProfile {
  bio: string;
  skills: string[];
  categories: string[];
  experience: string;
  hourlyRate: string;
  availability: string;
  serviceArea: string;
  professionalCredentials: {
    type: string;
    description: string;
    verified: boolean;
  }[];
  documents: {
    type: string;
    name: string;
    uploaded: boolean;
  }[];
  languages: string[];
  certifications: string[];
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "tasker">(
    (searchParams.get("role") as "customer" | "tasker") || "customer",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");

  // Tasker-specific profile data
  const [taskerProfile, setTaskerProfile] = useState<TaskerProfile>({
    bio: "",
    skills: [],
    categories: [],
    experience: "",
    hourlyRate: "",
    availability: "",
    serviceArea: "",
    professionalCredentials: [],
    documents: [],
    languages: ["English"],
    certifications: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCredential, setNewCredential] = useState({
    type: "",
    description: "",
  });
  const [newCertification, setNewCertification] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    [key: string]: boolean;
  }>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const skillCategories = [
    {
      id: "handyman",
      name: "Home & Handyman",
      icon: Wrench,
      subcategories: [
        "Plumbing",
        "Electrical",
        "Carpentry",
        "Painting",
        "Furniture Assembly",
      ],
    },
    {
      id: "transport",
      name: "Transportation",
      icon: Car,
      subcategories: [
        "Driving",
        "Moving",
        "Delivery",
        "Airport Pickup",
        "Food Delivery",
      ],
    },
    {
      id: "cleaning",
      name: "Cleaning",
      icon: Home,
      subcategories: [
        "House Cleaning",
        "Office Cleaning",
        "Deep Cleaning",
        "Organizing",
        "Laundry",
      ],
    },
    {
      id: "digital",
      name: "Digital Services",
      icon: Laptop,
      subcategories: [
        "Web Development",
        "Graphic Design",
        "Content Writing",
        "SEO",
        "Social Media",
      ],
    },
    {
      id: "creative",
      name: "Creative Services",
      icon: Camera,
      subcategories: [
        "Photography",
        "Video Editing",
        "Music Production",
        "Art & Design",
        "Writing",
      ],
    },
    {
      id: "personal",
      name: "Personal Care",
      icon: Heart,
      subcategories: [
        "Pet Care",
        "Elderly Care",
        "Babysitting",
        "Personal Training",
        "Massage",
      ],
    },
    {
      id: "education",
      name: "Education & Tutoring",
      icon: BookOpen,
      subcategories: [
        "Math Tutoring",
        "Language Teaching",
        "Music Lessons",
        "Test Prep",
        "Cooking Classes",
      ],
    },
    {
      id: "business",
      name: "Business Services",
      icon: Briefcase,
      subcategories: [
        "Accounting",
        "Legal Services",
        "Consulting",
        "Event Planning",
        "Virtual Assistant",
      ],
    },
  ];

  const addSkill = () => {
    if (newSkill && !taskerProfile.skills.includes(newSkill)) {
      setTaskerProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setTaskerProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addCredential = () => {
    if (newCredential.type && newCredential.description) {
      setTaskerProfile((prev) => ({
        ...prev,
        professionalCredentials: [
          ...prev.professionalCredentials,
          { ...newCredential, verified: false },
        ],
      }));
      setNewCredential({ type: "", description: "" });
    }
  };

  const addCertification = () => {
    if (
      newCertification &&
      !taskerProfile.certifications.includes(newCertification)
    ) {
      setTaskerProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification],
      }));
      setNewCertification("");
    }
  };

  const handleCategoryToggle = (category: string) => {
    setTaskerProfile((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleNextStep = () => {
    if (role === "customer" || currentStep === 3) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (role === "tasker") {
      if (!taskerProfile.bio || taskerProfile.categories.length === 0) {
        setError("Please complete your tasker profile");
        return;
      }
    }

    setIsLoading(true);

    try {
      await register(
        email,
        password,
        name,
        role,
        role === "tasker" ? taskerProfile : undefined,
        phone,
      );
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <Label>I want to:</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`p-4 rounded-lg border-2 transition-all ${
              role === "customer"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <User className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium">Hire Taskers</div>
            <div className="text-xs text-muted-foreground">
              Post tasks & get help
            </div>
          </button>
          <button
            type="button"
            onClick={() => setRole("tasker")}
            className={`p-4 rounded-lg border-2 transition-all ${
              role === "tasker"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Briefcase className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-sm font-medium">Work & Earn</div>
            <div className="text-xs text-muted-foreground">
              Complete tasks for money
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12 pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" required className="rounded" />
          <span className="text-sm">
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </Label>

        {role === "tasker" && (
          <div className="p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="font-medium">
                Next: Complete your tasker profile
              </span>
            </div>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-6">
              <li>• Tell us about your skills and experience</li>
              <li>• Add professional credentials and licenses</li>
              <li>• Upload verification documents</li>
              <li>• Set your rates and availability</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Tell us about yourself</h3>
        <p className="text-sm text-muted-foreground">
          Help customers understand what makes you the right person for their
          tasks
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell customers about your experience, what you're passionate about, and why they should hire you..."
          value={taskerProfile.bio}
          onChange={(e) =>
            setTaskerProfile((prev) => ({ ...prev, bio: e.target.value }))
          }
          className="min-h-24"
          maxLength={500}
        />
        <div className="text-xs text-muted-foreground text-right">
          {taskerProfile.bio.length}/500 characters
        </div>
      </div>

      <div className="space-y-3">
        <Label>What can you do? (Select categories)</Label>
        <div className="grid grid-cols-2 gap-2">
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = taskerProfile.categories.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <IconComponent className="w-5 h-5 mb-2 text-primary" />
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs text-muted-foreground">
                  {category.subcategories.slice(0, 2).join(", ")}
                  {category.subcategories.length > 2 && "..."}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Select
            value={taskerProfile.experience}
            onValueChange={(value) =>
              setTaskerProfile((prev) => ({ ...prev, experience: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
              <SelectItem value="intermediate">
                Intermediate (2-5 years)
              </SelectItem>
              <SelectItem value="expert">Expert (5+ years)</SelectItem>
              <SelectItem value="professional">
                Licensed Professional
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Starting Rate (per hour)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="hourlyRate"
              type="number"
              placeholder="25"
              value={taskerProfile.hourlyRate}
              onChange={(e) =>
                setTaskerProfile((prev) => ({
                  ...prev,
                  hourlyRate: e.target.value,
                }))
              }
              className="pl-8"
              min="5"
              max="500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceArea">Service Area</Label>
        <Input
          id="serviceArea"
          placeholder="e.g., Downtown Seattle, Remote work, Within 25 miles of..."
          value={taskerProfile.serviceArea}
          onChange={(e) =>
            setTaskerProfile((prev) => ({
              ...prev,
              serviceArea: e.target.value,
            }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Availability</Label>
        <Select
          value={taskerProfile.availability}
          onValueChange={(value) =>
            setTaskerProfile((prev) => ({ ...prev, availability: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="When are you available?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekdays">Weekdays only</SelectItem>
            <SelectItem value="weekends">Weekends only</SelectItem>
            <SelectItem value="flexible">Flexible schedule</SelectItem>
            <SelectItem value="evenings">Evenings and weekends</SelectItem>
            <SelectItem value="fulltime">Full-time availability</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Additional Skills</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a specific skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addSkill())
            }
          />
          <Button type="button" onClick={addSkill} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {taskerProfile.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-2 py-1">
              {skill}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2"
                onClick={() => removeSkill(skill)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Professional Verification
        </h3>
        <p className="text-sm text-muted-foreground">
          Build trust with customers by verifying your credentials and
          experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <Label className="text-base font-medium">
            Professional Credentials & Licenses
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            value={newCredential.type}
            onValueChange={(value) =>
              setNewCredential((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Credential type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
              <SelectItem value="commercial_license">
                Commercial Driver's License (CDL)
              </SelectItem>
              <SelectItem value="business_license">Business License</SelectItem>
              <SelectItem value="trade_license_plumbing">
                Plumbing License
              </SelectItem>
              <SelectItem value="trade_license_electrical">
                Electrical License
              </SelectItem>
              <SelectItem value="trade_license_hvac">HVAC License</SelectItem>
              <SelectItem value="trade_license_contractor">
                General Contractor License
              </SelectItem>
              <SelectItem value="professional_cert">
                Professional Certification
              </SelectItem>
              <SelectItem value="degree_bachelors">
                Bachelor's Degree
              </SelectItem>
              <SelectItem value="degree_masters">Master's Degree</SelectItem>
              <SelectItem value="degree_doctorate">Doctorate/PhD</SelectItem>
              <SelectItem value="degree_associates">
                Associate's Degree
              </SelectItem>
              <SelectItem value="insurance_liability">
                General Liability Insurance
              </SelectItem>
              <SelectItem value="insurance_bonding">
                Bonding Insurance
              </SelectItem>
              <SelectItem value="insurance_workers_comp">
                Workers Compensation
              </SelectItem>
              <SelectItem value="background_check">Background Check</SelectItem>
              <SelectItem value="drug_test">Drug Screening</SelectItem>
              <SelectItem value="first_aid">First Aid Certification</SelectItem>
              <SelectItem value="cpr_cert">CPR Certification</SelectItem>
              <SelectItem value="safety_cert">
                Safety Certification (OSHA)
              </SelectItem>
              <SelectItem value="real_estate">Real Estate License</SelectItem>
              <SelectItem value="notary">Notary Public</SelectItem>
              <SelectItem value="food_safety">
                Food Safety Certification
              </SelectItem>
              <SelectItem value="pet_cert">Pet Care Certification</SelectItem>
              <SelectItem value="childcare_cert">
                Childcare Certification
              </SelectItem>
              <SelectItem value="language_cert">
                Language Proficiency Certificate
              </SelectItem>
              <SelectItem value="other">
                Other Professional Credential
              </SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Description (e.g., Licensed Electrician, CDL Class A)"
            value={newCredential.description}
            onChange={(e) =>
              setNewCredential((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        <Button
          type="button"
          onClick={addCredential}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Credential
        </Button>

        <div className="space-y-2">
          {taskerProfile.professionalCredentials.map((cred, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {cred.type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
                <div className="text-xs text-muted-foreground">
                  {cred.description}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={cred.verified ? "default" : "secondary"}>
                  {cred.verified ? "Verified" : "Pending"}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTaskerProfile((prev) => ({
                      ...prev,
                      professionalCredentials:
                        prev.professionalCredentials.filter(
                          (_, i) => i !== index,
                        ),
                    }));
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {taskerProfile.professionalCredentials.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No credentials added yet. Add your first credential above.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-primary" />
          <Label className="text-base font-medium">Document Upload</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              type: "id_document",
              name: "Government ID",
              required: true,
              description: "Driver's License, Passport, or State ID",
            },
            {
              type: "proof_of_address",
              name: "Proof of Address",
              required: false,
              description: "Utility bill, bank statement, or lease",
            },
            {
              type: "professional_docs",
              name: "Professional Documents",
              required: false,
              description: "Licenses, certificates, or credentials",
            },
            {
              type: "insurance_docs",
              name: "Insurance Documents",
              required: false,
              description: "Liability insurance certificates",
            },
            {
              type: "portfolio",
              name: "Work Portfolio",
              required: false,
              description: "Photos of previous work",
            },
            {
              type: "references",
              name: "References",
              required: false,
              description: "Contact information for references",
            },
          ].map((doc) => {
            const isUploaded = uploadedDocuments[doc.type];
            return (
              <div
                key={doc.type}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                  isUploaded
                    ? "border-green-300 bg-green-50 dark:bg-green-950/20"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onClick={() => {
                  // Simulate file upload
                  setUploadedDocuments((prev) => ({
                    ...prev,
                    [doc.type]: !prev[doc.type],
                  }));

                  // Update documents in tasker profile
                  setTaskerProfile((prev) => {
                    const existingDocIndex = prev.documents.findIndex(
                      (d) => d.type === doc.type,
                    );
                    const newDocuments = [...prev.documents];

                    if (existingDocIndex >= 0) {
                      newDocuments[existingDocIndex] = {
                        ...newDocuments[existingDocIndex],
                        uploaded: !uploadedDocuments[doc.type],
                      };
                    } else {
                      newDocuments.push({
                        type: doc.type,
                        name: doc.name,
                        uploaded: true,
                      });
                    }

                    return { ...prev, documents: newDocuments };
                  });
                }}
              >
                {isUploaded ? (
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                ) : (
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                )}
                <div className="text-sm font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {doc.required ? "Required" : "Optional"}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {doc.description}
                </div>
                <Button
                  variant={isUploaded ? "default" : "outline"}
                  size="sm"
                  type="button"
                >
                  {isUploaded ? "✓ Uploaded" : "Upload"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-primary" />
          <Label className="text-base font-medium">
            Certifications & Training
          </Label>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add certification or training"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addCertification())
            }
          />
          <Button type="button" onClick={addCertification} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {taskerProfile.certifications.map((cert) => (
            <Badge key={cert} variant="outline" className="px-2 py-1">
              {cert}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2"
                onClick={() =>
                  setTaskerProfile((prev) => ({
                    ...prev,
                    certifications: prev.certifications.filter(
                      (c) => c !== cert,
                    ),
                  }))
                }
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Trust & Safety
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              All credentials will be verified by our team within 24-48 hours.
              Verified taskers get priority placement and higher trust scores.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back to home button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => {
            if (currentStep > 1 && role === "tasker") {
              setCurrentStep((prev) => prev - 1);
            } else {
              navigate("/");
            }
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep > 1 && role === "tasker"
            ? "Previous Step"
            : "Back to TaskIt"}
        </Button>

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">TaskIt</span>
            </div>

            {role === "tasker" && (
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 h-0.5 ${
                          step < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <CardTitle className="text-2xl">
              {currentStep === 1
                ? "Create your account"
                : currentStep === 2
                  ? "Build your profile"
                  : "Verify your credentials"}
            </CardTitle>
            <p className="text-muted-foreground">
              {currentStep === 1
                ? "Join thousands of people getting things done"
                : currentStep === 2
                  ? "Tell customers what makes you special"
                  : "Build trust with professional verification"}
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
              className="space-y-6"
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="flex justify-between">
                {currentStep > 1 && role === "tasker" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                <Button
                  type="submit"
                  className="ml-auto h-12 px-8"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating account..."
                    : role === "customer" || currentStep === 3
                      ? "Create Account"
                      : "Continue"}
                  {role === "customer" || currentStep === 3 ? null : (
                    <ChevronRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
