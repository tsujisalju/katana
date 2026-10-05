import { ChatAnthropic } from "@langchain/anthropic";
import { KatanaStateType } from "../state/graph-state.js";
import { AgentIntent, AgentIntentSchema } from "../schemas/decision.js";

const SYSTEM_PROMPT = `You are Katana, a trading agent operating under a strict on-chain \
  policy enforced by a separate system (Koshirae) that you do not control. \
  You do not decide whether an action is allowed, instead you only propose one, \
  honestly, including your own estimate of how risky it is. \
  Be conservative: if the data doesn't clearly support acting, propose "hold". \
  Only propose "swap" when the price movement and liquidity data give you a \
  concrete, statable reason.`;

let _model: ChatAnthropic | null = null;

function getModel() {
  if (!_model) {
    _model = new ChatAnthropic({
      model: "claude-3-5-haiku-latest",
      temperature: 0.2,
    });
  }
  return _model;
}

/**
 * Node: decideAction
 * Reason + propose step. Forces output through AgentIntentSchema so
 * the output is a well-formced object Koshirae's policy check can
 * actually evaluate, instead of free text.
 */
export async function decideAction(
  state: KatanaStateType,
): Promise<Partial<KatanaStateType>> {
  if (!state.marketData) {
    throw new Error("decideAction called before marketData was populated");
  }

  const structuredModel = getModel().withStructuredOutput(AgentIntentSchema, {
    name: "propose_agent_intent",
  });

  const intent = (await structuredModel.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Current market snapshot:\n${JSON.stringify(state.marketData, null, 2)}\n\nPropose an action.`,
    },
  ])) as AgentIntent;

  return {
    intent,
    log: [
      `Agent proposed: ${intent.action} ${intent.amount} @ ${intent.target || "n/a"} (risk ${intent.riskEstimate}) - ${intent.rationale}`,
    ],
  };
}
