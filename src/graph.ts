import { MemorySaver, StateGraph } from "@langchain/langgraph";
import { KatanaState } from "./state/graph-state.js";
import { fetchMarketData } from "./nodes/fetch-market-data.js";

export function buildKatanaGraph() {
    const graph = new StateGraph(KatanaState).addNode(
        "fetchMarketData",
        fetchMarketData,
    );

    const checkpointer = new MemorySaver();
    return graph.compile({ checkpointer });
}
