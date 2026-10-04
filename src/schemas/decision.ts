import { z } from "zod";

export const AgentIntentSchema = z.object({
    action: z
        .enum(["swap", "hold", "transfer"])
        .describe(
            "The action the agent wants to take. 'hold' means no on-chain action this cycle.",
        ),
    target: z
        .string()
        .describe(
            "The address or object ID this action targets. Empty string if the action is 'hold'.",
        ),
    amount: z
        .number()
        .nonnegative()
        .describe(
            "Amount denominated in the source asset. 0 if action is 'hold'",
        ),
    rationale: z
        .string()
        .describe(
            "Short explanation in natural language of why the agent is proposing this action.",
        ),
    riskEstimate: z
        .number()
        .min(0)
        .max(1)
        .describe(
            "The agent's own estimate of how risky this action is. 0 (safe) to 1 (risky)",
        ), // TODO: verify this maps to Koshirae's risk score scaling later
});
export type AgentIntent = z.infer<typeof AgentIntentSchema>;

export const KoshiraeVerdictSchema = z.object({
    verdict: z.enum(["approved", "flagged", "rejected"]),
    reason: z.string(),
});
export type KoshiraeVerdict = z.infer<typeof KoshiraeVerdictSchema>;
