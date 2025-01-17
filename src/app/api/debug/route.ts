import { createSolanaAnalysisGraph } from "@/lib/graph/contractGraph";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const graph = createSolanaAnalysisGraph();

    const result = await graph.invoke({
      contract_text: `
        // Sample Solana contract for testing
        pub mod my_program {
          use solana_program::*;
          // ... rest of contract
        }
      `
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}