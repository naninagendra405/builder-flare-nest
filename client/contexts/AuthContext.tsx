import React, { createContext, useContext, useState, useEffect } from "react";

export interface TaskerProfile {
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "tasker" | "admin";
  phone?: string;
  avatar?: string;
  rating?: number;
  location?: string;
  skills?: string[];
  verificationStatus?: "pending" | "verified" | "rejected";
  taskerProfile?: TaskerProfile;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: "customer" | "tasker",
    taskerProfile?: TaskerProfile,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("taskit-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      let mockUser: User;

      if (email === "tasker@demo.com") {
        // Demo tasker with full verification profile
        mockUser = {
          id: "demo-tasker",
          email,
          name: "John Smith",
          phone: "+1 (555) 123-4567",
          role: "tasker",
          rating: 4.9,
          verificationStatus: "verified",
          location: "New York, NY",
          taskerProfile: {
            bio: "Professional handyman with 10+ years of experience. I specialize in home repairs, electrical work, and furniture assembly. Licensed, insured, and committed to quality work.",
            skills: [
              "Plumbing",
              "Electrical Work",
              "Carpentry",
              "Painting",
              "Furniture Assembly",
            ],
            categories: ["handyman", "transport"],
            experience: "expert",
            hourlyRate: "45",
            availability: "flexible",
            serviceArea: "New York City and surrounding areas",
            professionalCredentials: [
              {
                type: "trade_license",
                description: "Licensed Electrician - State of NY",
                verified: true,
              },
              {
                type: "business_license",
                description: "General Contractor License",
                verified: true,
              },
              {
                type: "insurance",
                description: "General Liability Insurance - $1M coverage",
                verified: true,
              },
              {
                type: "background_check",
                description: "Background Check Completed",
                verified: false,
              },
            ],
            documents: [
              { type: "id_document", name: "Driver's License", uploaded: true },
              {
                type: "professional_docs",
                name: "Electrician License",
                uploaded: true,
              },
            ],
            languages: ["English", "Spanish"],
            certifications: [
              "EPA Universal Certification",
              "OSHA 10-Hour Safety",
              "Home Depot Pro Certified",
            ],
          },
        };
      } else {
        mockUser = {
          id: "1",
          email,
          name: email.split("@")[0],
          role: email.includes("admin") ? "admin" : "customer",
          rating: 4.8,
          verificationStatus: "verified",
        };
      }

      localStorage.setItem("taskit-user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "customer" | "tasker",
    taskerProfile?: TaskerProfile,
    phone?: string,
  ) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        phone,
        role,
        verificationStatus: role === "tasker" ? "pending" : "verified",
        taskerProfile: role === "tasker" ? taskerProfile : undefined,
        rating: role === "tasker" ? 0 : undefined,
        skills: role === "tasker" ? taskerProfile?.skills : undefined,
        location: role === "tasker" ? taskerProfile?.serviceArea : undefined,
      };

      localStorage.setItem("taskit-user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("taskit-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
