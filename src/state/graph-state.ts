import { Annotation } from "@langchain/langgraph";
import { PriceSnapshot } from "../schemas/market-data.js";
import { AgentIntent, KoshiraeVerdict } from "../schemas/decision.js";

export const KatanaState = Annotation.Root({
    marketData: Annotation<PriceSnapshot | null>({
        reducer: (_prev, next) => next,
        default: () => null,
    }),
    intent: Annotation<AgentIntent | null>({
        reducer: (_prev, next) => next,
        default: () => null,
    }),
    verdict: Annotation<KoshiraeVerdict | null>({
        reducer: (_prev, next) => next,
        default: () => null,
    }),
    log: Annotation<string[]>({
        reducer: (prev, next) => prev.concat(next),
        default: () => [],
    }),
});

export type KatanaStateType = typeof KatanaState.State;
