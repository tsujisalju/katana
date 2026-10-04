export interface PriceSnapshot {
    pair: string;
    price: number;
    change24hPct: number;
    poolLiquidityUsd: number;
    timestamp: string;
}

export function getMockPriceSnapshot(): PriceSnapshot {
    // Static but plausible numbers for local dev.
    // Replace with a real Deepbook/Cetus query.
    return {
        pair: "SUI-USDC",
        price: 1.42,
        change24hPct: -3.8,
        poolLiquidityUsd: 4_250_000,
        timestamp: new Date().toISOString(),
    };
}
