import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Shield,
  Plus,
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Award,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Credential {
  type: string;
  description: string;
  verified: boolean;
}

export default function AddCredentials() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newCredential, setNewCredential] = useState({
    type: "",
    description: "",
  });
  const [newCertification, setNewCertification] = useState("");
  const [credentials, setCredentials] = useState<Credential[]>(
    user?.taskerProfile?.professionalCredentials || [],
  );
  const [certifications, setCertifications] = useState<string[]>(
    user?.taskerProfile?.certifications || [],
  );
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    [key: string]: boolean;
  }>({});
  const [successMessage, setSuccessMessage] = useState("");

  if (!user || user.role !== "tasker") {
    navigate("/dashboard");
    return null;
  }

  const addCredential = () => {
    if (newCredential.type && newCredential.description) {
      setCredentials((prev) => [
        ...prev,
        { ...newCredential, verified: false },
      ]);
      setNewCredential({ type: "", description: "" });
    }
  };

  const removeCredential = (index: number) => {
    setCredentials((prev) => prev.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    if (newCertification && !certifications.includes(newCertification)) {
      setCertifications((prev) => [...prev, newCertification]);
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications((prev) => prev.filter((c) => c !== cert));
  };

  const handleSave = () => {
    // Here you would update the user's profile in the database
    // For now, we'll just show a success message
    setSuccessMessage(
      "Your credentials have been updated successfully! Our team will review them within 24-48 hours.",
    );

    // Simulate saving to localStorage for demo
    const updatedUser = {
      ...user,
      taskerProfile: {
        ...user.taskerProfile!,
        professionalCredentials: credentials,
        certifications: certifications,
      },
    };
    localStorage.setItem("taskit-user", JSON.stringify(updatedUser));

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F49df43ed9ff0405e8e16cefcd448c514%2F4f70d3bad8334dbfa7beca7d1e69b919?format=webp&width=800"
                alt="DOZO Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <CardTitle className="text-2xl">
              Add Professional Credentials
            </CardTitle>
            <p className="text-muted-foreground">
              Enhance your profile with additional credentials and
              certifications
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {successMessage && (
              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Professional Credentials */}
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
                    <SelectItem value="drivers_license">
                      Driver's License
                    </SelectItem>
                    <SelectItem value="commercial_license">
                      Commercial Driver's License (CDL)
                    </SelectItem>
                    <SelectItem value="business_license">
                      Business License
                    </SelectItem>
                    <SelectItem value="trade_license_plumbing">
                      Plumbing License
                    </SelectItem>
                    <SelectItem value="trade_license_electrical">
                      Electrical License
                    </SelectItem>
                    <SelectItem value="trade_license_hvac">
                      HVAC License
                    </SelectItem>
                    <SelectItem value="trade_license_contractor">
                      General Contractor License
                    </SelectItem>
                    <SelectItem value="professional_cert">
                      Professional Certification
                    </SelectItem>
                    <SelectItem value="degree_bachelors">
                      Bachelor's Degree
                    </SelectItem>
                    <SelectItem value="degree_masters">
                      Master's Degree
                    </SelectItem>
                    <SelectItem value="degree_doctorate">
                      Doctorate/PhD
                    </SelectItem>
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
                    <SelectItem value="background_check">
                      Background Check
                    </SelectItem>
                    <SelectItem value="drug_test">Drug Screening</SelectItem>
                    <SelectItem value="first_aid">
                      First Aid Certification
                    </SelectItem>
                    <SelectItem value="cpr_cert">CPR Certification</SelectItem>
                    <SelectItem value="safety_cert">
                      Safety Certification (OSHA)
                    </SelectItem>
                    <SelectItem value="real_estate">
                      Real Estate License
                    </SelectItem>
                    <SelectItem value="notary">Notary Public</SelectItem>
                    <SelectItem value="food_safety">
                      Food Safety Certification
                    </SelectItem>
                    <SelectItem value="pet_cert">
                      Pet Care Certification
                    </SelectItem>
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
                {credentials.map((cred, index) => (
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
                        onClick={() => removeCredential(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {credentials.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No credentials added yet. Add your first credential above.
                  </div>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-primary" />
                <Label className="text-base font-medium">Document Upload</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    type: "additional_id",
                    name: "Additional ID Documents",
                    description: "Professional licenses, certificates",
                  },
                  {
                    type: "insurance_docs",
                    name: "Insurance Documents",
                    description: "Liability insurance certificates",
                  },
                  {
                    type: "portfolio",
                    name: "Work Portfolio",
                    description: "Photos of previous work",
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
                        setUploadedDocuments((prev) => ({
                          ...prev,
                          [doc.type]: !prev[doc.type],
                        }));
                      }}
                    >
                      {isUploaded ? (
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      ) : (
                        <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      )}
                      <div className="text-sm font-medium">{doc.name}</div>
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

            {/* Certifications */}
            <div className="space-y-4">
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
                    e.key === "Enter" &&
                    (e.preventDefault(), addCertification())
                  }
                />
                <Button type="button" onClick={addCertification} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">
                  Popular Certifications (click to add):
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {[
                    "First Aid/CPR",
                    "OSHA 10-Hour Safety",
                    "EPA Certified",
                    "Home Depot Pro",
                    "Google Ads Certified",
                    "Microsoft Office",
                    "CDL Class A/B",
                  ]
                    .filter((cert) => !certifications.includes(cert))
                    .slice(0, 5)
                    .map((suggestedCert) => (
                      <Button
                        key={suggestedCert}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2 border border-dashed border-muted-foreground/30 hover:border-primary"
                        onClick={() => {
                          setCertifications((prev) => [...prev, suggestedCert]);
                        }}
                      >
                        + {suggestedCert}
                      </Button>
                    ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="px-2 py-1">
                    {cert}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-2"
                      onClick={() => removeCertification(cert)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
                {certifications.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No certifications added yet. Try the quick-add options
                    above.
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="px-8">
                Save Credentials
              </Button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Trust & Safety
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    All credentials will be verified by our team within 24-48
                    hours. Verified taskers get priority placement and higher
                    trust scores.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
