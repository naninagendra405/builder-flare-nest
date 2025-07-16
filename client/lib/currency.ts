/**
 * Currency utilities for Indian Rupees (INR)
 */

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 10000000) {
    // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};

export const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[₹,\s]/g, "");
  return parseFloat(cleanValue) || 0;
};

// Convert USD to INR (approximate conversion rate)
export const convertUSDToINR = (usdAmount: number): number => {
  const exchangeRate = 83.5; // Approximate INR per USD
  return Math.round(usdAmount * exchangeRate);
};
