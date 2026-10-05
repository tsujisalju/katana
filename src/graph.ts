import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { KatanaState } from "./state/graph-state.js";
import { fetchMarketData } from "./nodes/fetch-market-data.js";
import { decideAction } from "./nodes/decide-action.js";
import { checkPolicyNode, routeOnVerdict } from "./nodes/check-policy.js";
import {
  awaitApproval,
  executeAction,
  logRejection,
} from "./nodes/outcomes.js";

export function buildKatanaGraph() {
  const graph = new StateGraph(KatanaState)
    .addNode("fetchMarketData", fetchMarketData)
    .addNode("decideAction", decideAction)
    .addNode("checkPolicyNode", checkPolicyNode)
    .addNode("executeAction", executeAction)
    .addNode("awaitApproval", awaitApproval)
    .addNode("logRejection", logRejection)
    .addEdge(START, "fetchMarketData")
    .addEdge("fetchMarketData", "decideAction")
    .addEdge("decideAction", "checkPolicyNode")
    .addConditionalEdges("checkPolicyNode", routeOnVerdict, {
      executeAction: "executeAction",
      awaitApproval: "awaitApproval",
      logRejection: "logRejection",
    })
    .addEdge("executeAction", END)
    .addEdge("awaitApproval", END)
    .addEdge("logRejection", END);

  const checkpointer = new MemorySaver();
  return graph.compile({ checkpointer });
}
