import { v4 as uuidv4 } from "uuid";

export const generateUUID = (): string => {
  return uuidv4();
};

export const generateBookingReference = (): string => {
  return `BK-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
};

export const formatCurrency = (amount: number, currency: string = "INR"): string => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  });
  return formatter.format(amount);
};

export const calculateTax = (amount: number, taxPercent: number): number => {
  return Math.round((amount * taxPercent) / 100 * 100) / 100;
};

export const calculateDiscount = (amount: number, discountPercent: number): number => {
  return Math.round((amount * discountPercent) / 100 * 100) / 100;
};

export const getDateRange = (startDate: Date, endDate: Date): number => {
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const isDateInPast = (date: Date): boolean => {
  return date < new Date();
};

export const isDateUpcoming = (date: Date, daysAhead: number = 30): boolean => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  return date >= new Date() && date <= futureDate;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
  throw new Error("Max retries exceeded");
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.substring(0, length) + "..." : str;
};
