// AI-based pricing suggestions for different task categories and complexities

interface PricingSuggestion {
  min: number;
  max: number;
  recommended: number;
  reasoning: string;
}

interface TaskDetails {
  category: string;
  title: string;
  description: string;
  location?: string;
  urgency?: "low" | "medium" | "high";
  timeEstimate?: string;
}

// Mock AI pricing data based on common task patterns
const categoryBasePricing: Record<string, { base: number; hourly: number }> = {
  "Home Repair": { base: 50, hourly: 35 },
  "Digital Services": { base: 75, hourly: 45 },
  "Emergency Help": { base: 40, hourly: 30 },
  Handyman: { base: 45, hourly: 32 },
  "Business Services": { base: 80, hourly: 50 },
  "Transport & Moving": { base: 60, hourly: 25 },
  "Events & Personal": { base: 35, hourly: 28 },
  Cleaning: { base: 30, hourly: 25 },
  Tutoring: { base: 40, hourly: 35 },
};

const complexityMultipliers = {
  simple: 0.8,
  medium: 1.0,
  complex: 1.4,
  expert: 1.8,
};

const urgencyMultipliers = {
  low: 0.9,
  medium: 1.0,
  high: 1.3,
};

const locationMultipliers: Record<string, number> = {
  Manhattan: 1.4,
  Brooklyn: 1.2,
  Queens: 1.1,
  "San Francisco": 1.5,
  "Los Angeles": 1.3,
  Remote: 0.9,
};

function analyzeComplexity(
  title: string,
  description: string,
): keyof typeof complexityMultipliers {
  const text = (title + " " + description).toLowerCase();

  // Expert level keywords
  if (
    text.includes("electrical") ||
    text.includes("plumbing") ||
    text.includes("professional") ||
    text.includes("certified") ||
    text.includes("licensed") ||
    text.includes("advanced")
  ) {
    return "expert";
  }

  // Complex level keywords
  if (
    text.includes("install") ||
    text.includes("repair") ||
    text.includes("design") ||
    text.includes("custom") ||
    text.includes("complex") ||
    text.includes("multiple")
  ) {
    return "complex";
  }

  // Simple level keywords
  if (
    text.includes("clean") ||
    text.includes("move") ||
    text.includes("basic") ||
    text.includes("simple") ||
    text.includes("help with") ||
    text.includes("assistance")
  ) {
    return "simple";
  }

  return "medium";
}

function getTimeMultiplier(timeEstimate?: string): number {
  if (!timeEstimate) return 1.0;

  const time = timeEstimate.toLowerCase();
  if (time.includes("1-2 hours")) return 0.7;
  if (time.includes("half day") || time.includes("3-4 hours")) return 1.0;
  if (time.includes("full day") || time.includes("6-8 hours")) return 1.8;
  if (time.includes("2-3 days")) return 3.0;
  if (time.includes("1 week")) return 5.0;
  if (time.includes("2+ weeks")) return 8.0;

  return 1.0;
}

export function getAIPricingSuggestion(
  taskDetails: TaskDetails,
): PricingSuggestion {
  const {
    category,
    title,
    description,
    location,
    urgency = "medium",
    timeEstimate,
  } = taskDetails;

  // Get base pricing for category
  const basePricing = categoryBasePricing[category] || { base: 50, hourly: 35 };

  // Analyze complexity
  const complexity = analyzeComplexity(title, description);
  const complexityMultiplier = complexityMultipliers[complexity];

  // Apply urgency multiplier
  const urgencyMultiplier = urgencyMultipliers[urgency];

  // Apply location multiplier
  const locationKey = location?.split(",")[0]?.trim() || "Remote";
  const locationMultiplier = locationMultipliers[locationKey] || 1.0;

  // Apply time multiplier
  const timeMultiplier = getTimeMultiplier(timeEstimate);

  // Calculate base price
  let basePrice =
    basePricing.base *
    complexityMultiplier *
    urgencyMultiplier *
    locationMultiplier;

  // For time-based tasks, factor in duration
  if (timeEstimate && !timeEstimate.includes("hour")) {
    basePrice *= timeMultiplier;
  }

  // Calculate range
  const min = Math.max(15, Math.round(basePrice * 0.7));
  const max = Math.round(basePrice * 1.4);
  const recommended = Math.round(basePrice);

  // Generate reasoning
  let reasoning = `Based on ${category.toLowerCase()} category (${complexity} complexity)`;
  if (urgency === "high") reasoning += ", urgent timeline";
  if (locationMultiplier > 1.1)
    reasoning += `, ${locationKey} location premium`;
  if (timeMultiplier > 1.5) reasoning += ", extended duration";
  reasoning += ".";

  return {
    min,
    max,
    recommended,
    reasoning,
  };
}

export function getPopularTaskPricing(): Array<{
  title: string;
  category: string;
  averagePrice: number;
  priceRange: string;
}> {
  return [
    {
      title: "Kitchen sink repair",
      category: "Home Repair",
      averagePrice: 75,
      priceRange: "₹50 - ₹120",
    },
    {
      title: "Logo design",
      category: "Digital Services",
      averagePrice: 250,
      priceRange: "₹150 - ₹400",
    },
    {
      title: "Apartment cleaning",
      category: "Cleaning",
      averagePrice: 80,
      priceRange: "₹60 - ₹120",
    },
    {
      title: "Furniture assembly",
      category: "Handyman",
      averagePrice: 65,
      priceRange: "₹40 - ₹100",
    },
    {
      title: "Math tutoring",
      category: "Tutoring",
      averagePrice: 45,
      priceRange: "₹30 - ₹70",
    },
    {
      title: "Moving help",
      category: "Transport & Moving",
      averagePrice: 90,
      priceRange: "₹60 - ₹140",
    },
  ];
}
