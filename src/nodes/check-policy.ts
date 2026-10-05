import { checkKoshiraePolicy } from "../koshirae/client.js";
import { KatanaStateType } from "../state/graph-state.js";

/**
 * Node: checkKoshiraePolicy
 * This is the Katana-Koshirae boundary.
 * Everything from here on is Koshirae's
 * enforcement layer reacting to what the agent proposed.
 */
export async function checkPolicyNode(
  state: KatanaStateType,
): Promise<Partial<KatanaStateType>> {
  if (!state.intent) {
    throw new Error("checkPolicyNode called before intent was populated");
  }

  const verdict = await checkKoshiraePolicy(state.intent);

  return {
    verdict,
    log: [`Koshirae verdict: ${verdict.verdict} - ${verdict.reason}`],
  };
}

/**
 * Conditional edge function: routes based on Koshirae's verdict.
 * LangGraph calls this after checkPolicyNode to decide which node
 * runs next.
 */
export function routeOnVerdict(
  state: KatanaStateType,
): "executeAction" | "awaitApproval" | "logRejection" {
  switch (state.verdict?.verdict) {
    case "approved":
      return "executeAction";
    case "flagged":
      return "awaitApproval";
    case "rejected":
    default:
      return "logRejection";
  }
}
