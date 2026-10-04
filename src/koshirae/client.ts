import type { AgentIntent, KoshiraeVerdict } from "../schemas/decision.js";

/**
 * Stand-in for Koshirae's policy-check call. This is the exact
 * boundary described in the project: Katana's job stops at producing
 * a well-formed AgentIntent; Koshirae's AgentCap is what actually
 * enforces spending limits, allowed targets, and risk threshold
 * on-chain.
 *
 * TODO(koshirae-integration): replace this function's body with a
 * real call into the Koshirae SDK/API once it's available to import
 * here — something like:
 *
 *   import { AgentCap } from "@koshirae/sdk";
 *   const cap = await AgentCap.load(agentCapObjectId, suiClient);
 *   return cap.evaluate(intent);
 *
 * Until then, this mock applies a simple static policy so the rest of
 * the graph (branching on the verdict, logging, human-in-the-loop)
 * can be built and tested end-to-end without the real integration
 * blocking progress.
 */
export interface MockPolicy {
    maxAmount: number;
    allowedTargets: string[];
    riskThreshold: number;
}

export const DEFAULT_MOCK_POLICY: MockPolicy = {
    maxAmount: 500,
    allowedTargets: ["cetus:SUI-USDC"],
    riskThreshold: 0.6,
};

export async function checkKoshiraePolicy(
    intent: AgentIntent,
    policy: MockPolicy = DEFAULT_MOCK_POLICY,
): Promise<KoshiraeVerdict> {
    if (intent.action === "hold") {
        return { verdict: "approved", reason: "No on-chain action proposed." };
    }

    if (!policy.allowedTargets.includes(intent.target)) {
        return {
            verdict: "rejected",
            reason: `Target '${intent.target}' is not in the agent's allowed target list.`,
        };
    }

    if (intent.amount > policy.maxAmount) {
        return {
            verdict: "flagged",
            reason: `Amount ${intent.amount} exceeds policy max of ${policy.maxAmount}.`,
        };
    }

    if (intent.riskEstimate > policy.riskThreshold) {
        return {
            verdict: "flagged",
            reason: `Agent's own risk estimate (${intent.riskEstimate}) exceeds threshold (${policy.riskThreshold}).`,
        };
    }

    return { verdict: "approved", reason: "Within policy limits." };
}
