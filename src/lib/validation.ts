import { z } from "zod";

import { CONDITIONS, GENRES, type VinylInput } from "@/types/vinyl";

const currentYear = new Date().getFullYear();

export const genreSchema = z.enum(GENRES);

export const conditionSchema = z.enum(CONDITIONS);

export const vinylInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  artist: z.string().trim().min(1, "Artist is required"),
  year: z
    .number()
    .int("Year must be an integer")
    .min(1900, "Year must be 1900 or later")
    .max(currentYear + 1, `Year must be ${currentYear + 1} or earlier`),
  genre: genreSchema,
  condition: conditionSchema,
  isColoredVinyl: z.boolean(),
  pricePaid: z.number().min(0, "Price paid must be 0 or greater"),
  catalogNumber: z.string().trim().min(1, "Catalog number is required"),
  notes: z.string(),
  acquiredAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Acquired date must be YYYY-MM-DD"),
});

export type ParseVinylInputResult =
  | { success: true; data: VinylInput }
  | {
      success: false;
      error: string;
      fieldErrors: Record<string, string[]>;
    };

export function parseVinylInput(input: unknown): ParseVinylInputResult {
  const result = vinylInputSchema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const { fieldErrors, formErrors } = z.flattenError(result.error);

  return {
    success: false,
    error: formErrors[0] ?? "Validation failed",
    fieldErrors,
  };
}
