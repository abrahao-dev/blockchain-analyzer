import { createSolanaAnalysisGraph } from "@/lib/graph/contractGraph";
import { fetchContractFromSolscan } from "@/lib/utils/solscan";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { contract_address, contract_text } = await req.json();

    let contractCode = contract_text;

    // If address is provided, fetch from Solscan
    if (contract_address && !contract_text) {
      try {
        const solscanData = await fetchContractFromSolscan(contract_address);
        contractCode = solscanData.source || solscanData.byteCode;
      } catch (error) {
        console.error("Solscan fetch error:", error);
        return NextResponse.json(
          { error: "Failed to fetch contract from Solscan" },
          { status: 400 }
        );
      }
    }

    if (!contractCode) {
      return NextResponse.json(
        { error: "Contract code is required" },
        { status: 400 }
      );
    }

    const graph = createSolanaAnalysisGraph();

    try {
      const result = await graph.invoke({
        contract_text: contractCode,
      });

      return NextResponse.json({ results: result });  // Wrap result in results object
    } catch (graphError) {
      console.error("Graph execution error:", graphError);
      return NextResponse.json(
        { error: "Failed to execute analysis graph" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze contract: " + (error as Error).message },
      { status: 500 }
    );
  }
}
