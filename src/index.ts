import { buildKatanaGraph } from "./graph.js";

async function main() {
  const app = buildKatanaGraph();
  const config = { configurable: { thread_id: `katana-run-${Date.now()}` } };

  const result = await app.invoke({}, config);

  console.log("\n--- Katana run log ---");
  for (const line of result.log) console.log(`- ${line}`);

  if ((result as Record<string, unknown>).__interrupt__) {
    console.log("\n--- Paused for human approval ---");
    console.log(
      JSON.stringify(
        (result as Record<string, unknown>).__interrupt__,
        null,
        2,
      ),
    );
    console.log("\nResume withL Command({ result: 'approve' | 'reject' })");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
