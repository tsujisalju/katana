import { getMockPriceSnapshot } from "../schemas/market-data.js";
import { KatanaStateType } from "../state/graph-state.js";

export async function fetchMarketData(
    _state: KatanaStateType,
): Promise<Partial<KatanaStateType>> {
    const snapshot = getMockPriceSnapshot();
    return {
        marketData: snapshot,
        log: [
            `Fetched market data: ${snapshot.pair} @ ${snapshot.price} (${snapshot.change24hPct}% 24h)`,
        ],
    };
}
