import { z } from "zod";

export const IntakeSchema = z.object({
  state: z.string(),
  stage: z.enum(["before", "already"]),
  perspective: z.enum(["renter", "landlord", "both"]),
  isParent: z.boolean().default(false),
  receivesHousingAid: z.boolean().default(false),
  isStudent: z.boolean().default(false),
  reviewingForSomeoneElse: z.boolean().default(false),
  language: z.enum(["en", "es"]).default("en"),
});
export type Intake = z.infer<typeof IntakeSchema>;

export const SeveritySchema = z.enum(["low", "medium", "high"]);

export const KeyTermSchema = z.object({
  label: z.string(),
  value: z.string(),
  original_quote: z.string().optional(),
  status: z.enum(["standard", "check", "flag"]).optional(),
  note: z.string().optional(),
});

export const PotentialIssueSchema = z.object({
  severity: SeveritySchema,
  title: z.string(),
  explanation: z.string(),
  citation: z.string().optional(),
  original_quote: z.string().optional(),
});

export const MissingProtectionSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  helps: z.enum(["renter", "landlord", "both"]),
});

export const ParentConsiderationSchema = z.object({
  title: z.string(),
  explanation: z.string(),
});

export const FinancialImpactItemSchema = z.object({
  label: z.string(),
  amount: z.string(),
  basis: z.string(),
});

export const FinancialImpactSchema = z.object({
  items: z.array(FinancialImpactItemSchema),
  total_estimate: z.string(),
  note: z.string().optional(),
});

export const NegotiationScriptSchema = z.object({
  clause: z.string(),
  ask: z.string(),
});

export const NegotiationSchema = z.object({
  email: z.string(),
  scripts: z.array(NegotiationScriptSchema),
  tone_note: z.string().optional(),
});

export const AnalysisResultSchema = z.object({
  key_terms: z.array(KeyTermSchema),
  potential_issues: z.array(PotentialIssueSchema),
  missing_protections: z.object({
    renter: z.array(MissingProtectionSchema),
    landlord: z.array(MissingProtectionSchema),
  }),
  parent_considerations: z.array(ParentConsiderationSchema).optional(),
  financial_impact: FinancialImpactSchema.optional(),
  negotiation: NegotiationSchema.optional(),
  questions: z.array(z.string()),
  stats: z.object({
    potential_issues: z.number(),
    missing_protections: z.number(),
    questions: z.number(),
  }),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(50),
  context: z
    .object({
      state: z.string().optional().nullable(),
      intake: z
        .object({
          state: z.string(),
          stage: z.string(),
          perspective: z.string(),
          isParent: z.boolean().optional(),
          receivesHousingAid: z.boolean().optional(),
          isStudent: z.boolean().optional(),
          reviewingForSomeoneElse: z.boolean().optional(),
        })
        .optional()
        .nullable(),
      analysisResult: z.any().optional().nullable(),
    })
    .optional()
    .nullable(),
});
