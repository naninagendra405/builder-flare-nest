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

// Mock AI pricing data based on common task patterns (INR pricing)
const categoryBasePricing: Record<string, { base: number; hourly: number }> = {
  "Home Repair": { base: 4200, hourly: 2900 },
  "Digital Services": { base: 6300, hourly: 3800 },
  "Emergency Help": { base: 3300, hourly: 2500 },
  Handyman: { base: 3800, hourly: 2700 },
  "Business Services": { base: 6700, hourly: 4200 },
  "Transport & Moving": { base: 5000, hourly: 2100 },
  "Events & Personal": { base: 2900, hourly: 2300 },
  Cleaning: { base: 2500, hourly: 2100 },
  Tutoring: { base: 3300, hourly: 2900 },
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

  // Calculate range (minimum ₹125 for any task)
  const min = Math.max(125, Math.round(basePrice * 0.7));
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
      averagePrice: 6300,
      priceRange: "₹4,200 - ₹10,000",
    },
    {
      title: "Logo design",
      category: "Digital Services",
      averagePrice: 20900,
      priceRange: "₹12,500 - ₹33,400",
    },
    {
      title: "Apartment cleaning",
      category: "Cleaning",
      averagePrice: 6700,
      priceRange: "₹5,000 - ₹10,000",
    },
    {
      title: "Furniture assembly",
      category: "Handyman",
      averagePrice: 5400,
      priceRange: "₹3,300 - ₹8,400",
    },
    {
      title: "Math tutoring",
      category: "Tutoring",
      averagePrice: 3800,
      priceRange: "₹2,500 - ₹5,800",
    },
    {
      title: "Moving help",
      category: "Transport & Moving",
      averagePrice: 7500,
      priceRange: "₹5,000 - ₹11,700",
    },
  ];
}
