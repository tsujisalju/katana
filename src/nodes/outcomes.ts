import { interrupt } from "@langchain/langgraph";
import { KatanaStateType } from "../state/graph-state.js";

/**
 * Node: executeAction
 * Reached when Koshirae approved the proposal automatically.
 * Stubbed, the real version submits the Sui transaction
 * (via the Koshirae SDK or directly) once that integration lands.
 */
export async function executeAction(
  state: KatanaStateType,
): Promise<Partial<KatanaStateType>> {
  return {
    log: [`Executed: ${state.intent?.action}`],
  };
}

/**
 * Node: awaitApproval
 * Reached when Koshirae flagged the proposal for human review.
 * Uses LangGraph's `interrupt` so the graph pauses here and hands
 * control back to a human. This is the human-in-the-loop pattern
 * mapped directly onto Koshirae's "flagged action awaiting approval"
 * state, rather than something Katana has to invent on its own.
 */
export async function awaitApproval(
  state: KatanaStateType,
): Promise<Partial<KatanaStateType>> {
  const decision = interrupt({
    reason: "Koshirae flagged this action for manual approval.",
    intent: state.intent,
    verdict: state.verdict,
  });

  const approved = decision === "approve";
  return {
    log: [
      approved
        ? `Human approved flagged action: ${state.intent?.action} ${state.intent?.amount} @ ${state.intent?.target}`
        : `Human rejected flagged action: ${state.intent?.action} ${state.intent?.amount} @ ${state.intent?.target}`,
    ],
  };
}

/**
 * Node: logRejection
 * Reached when Koshirae rejected the proposal outright (e.g. target)
 * not in the allowed list). No human interrupt needed, this is a
 * hard policy boundary, not a judgement call.
 */
export async function logRejection(
  state: KatanaStateType,
): Promise<Partial<KatanaStateType>> {
  return {
    log: [`Rejected by policy, no action taken: ${state.verdict?.reason}`],
  };
}
