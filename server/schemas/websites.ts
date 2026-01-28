import { z } from "zod";

export const createWebsiteSchema = z.object({
  name: z
    .string()
    .min(1, "Website name is required")
    .max(255, "Website name must be less than 255 characters"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .url("Invalid domain URL")
    .max(255, "Domain must be less than 255 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

export const updateWebsiteSchema = z.object({
  name: z
    .string()
    .min(1, "Website name is required")
    .max(255, "Website name must be less than 255 characters")
    .optional(),
  domain: z
    .string()
    .min(1, "Domain is required")
    .url("Invalid domain URL")
    .max(255, "Domain must be less than 255 characters")
    .optional(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
});

export type CreateWebsiteRequest = z.infer<typeof createWebsiteSchema>;
export type UpdateWebsiteRequest = z.infer<typeof updateWebsiteSchema>;

export interface WebsiteResponse {
  id: string;
  userId: string;
  name: string;
  domain: string;
  description?: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsitesListResponse {
  websites: WebsiteResponse[];
  total: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}
