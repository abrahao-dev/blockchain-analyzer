import { analyzeContract, TEST_ADDRESS } from './contractGraph';

async function testAnalysis() {
  try {
    console.log("Starting test analysis...");
    const results = await analyzeContract(TEST_ADDRESS);
    console.log("Analysis results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run test if executed directly
if (require.main === module) {
  testAnalysis();
}