import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = (): string => {
  if (!process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    throw new Error("NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL not found");
  }
  if (!process.env.NEXT_PUBLIC_VERCEL_ENV) {
    throw new Error("NEXT_PUBLIC_VERCEL_ENV not found");
  }

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "local") {
    return `http://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  } else {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }
};

export const validateField = (
  field: string | undefined,
  fieldName: string
): string | null => {
  if (!field) {
    return `No ${fieldName} provided`;
  }
  return null;
};
