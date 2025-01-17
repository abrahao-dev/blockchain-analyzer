import { ChatPromptTemplate } from '@langchain/core/prompts'
import { Annotation, END, START, StateGraph } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'
import { fetchContractFromSolscan } from '../utils/solscan'

// Define graph state with proper annotations
const GraphState = Annotation.Root({
  messages: Annotation.Array({
    reducer: (x, y) => y ?? x ?? [],
  }),
  contract_address: Annotation.String({
    reducer: (x, y) => y ?? x ?? '',
  }),
  contract_text: Annotation.String({
    reducer: (x, y) => y ?? x ?? '',
  }),
  parsed_sections: Annotation.Array({
    reducer: (x, y) => y ?? x ?? [],
  }),
  results: Annotation.Any({
    reducer: (x, y) => y ?? x ?? null,
  }),
  error: Annotation.Any({
    reducer: (x, y) => y ?? x ?? null,
  }),
})

// Node functions
async function fetchContract(state: typeof GraphState.State) {
  try {
    console.log('Fetching contract:', state.contract_address)
    const programData = await fetchContractFromSolscan(state.contract_address)
    return {
      contract_text: programData.source || '',
      error: null,
    }
  } catch (error) {
    return {
      error: {
        code: 'FetchError',
        message: error instanceof Error ? error.message : 'Failed to fetch contract',
      },
    }
  }
}

async function parseContract(state: typeof GraphState.State) {
  try {
    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0,
    })

    const prompt = ChatPromptTemplate.fromTemplate(`
      Analyze the following Solana program code:
      {contract_text}

      Focus on:
      1. Program type and main functionality
      2. Entry points and instruction handlers
      3. Account structures and relationships
      4. State management approach
      5. Critical security sections

      Return the analysis in a JSON array format with 'title' and 'content' for each section.
    `)

    const chain = prompt.pipe(model)
    const response = await chain.invoke({
      contract_text: state.contract_text,
    })

    return {
      parsed_sections: JSON.parse(response.content),
      error: null,
    }
  } catch (error) {
    return {
      error: {
        code: 'ParseError',
        message: error instanceof Error ? error.message : 'Failed to parse contract',
      },
    }
  }
}

async function analyzeContract(state: typeof GraphState.State) {
  try {
    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0,
    })

    const analysisSchema = z.object({
      program_type: z.string(),
      security_score: z.number().min(0).max(100),
      findings: z.array(z.object({
        category: z.string(),
        severity: z.enum(['low', 'medium', 'high']),
        description: z.string(),
      })),
      recommendations: z.array(z.string()),
    })

    const llmWithTool = model.withStructuredOutput(analysisSchema)

    const prompt = ChatPromptTemplate.fromTemplate(`
      Given these Solana program sections:
      {parsed_sections}

      Perform a comprehensive security analysis focusing on:
      1. Solana-specific vulnerabilities
      2. Proper privilege checks
      3. Arithmetic overflow risks
      4. Cross-program invocation security
      5. Resource consumption

      Return a detailed analysis following the specified schema.
    `)

    const chain = prompt.pipe(llmWithTool)
    const response = await chain.invoke({
      parsed_sections: JSON.stringify(state.parsed_sections),
    })

    return {
      results: response,
      error: null,
    }
  } catch (error) {
    return {
      error: {
        code: 'AnalysisError',
        message: error instanceof Error ? error.message : 'Failed to analyze contract',
      },
    }
  }
}

// Build and compile graph
const workflow = new StateGraph(GraphState)
  .addNode('fetchContract', fetchContract)
  .addNode('parseContract', parseContract)
  .addNode('analyzeContract', analyzeContract)

workflow
  .addEdge(START, 'fetchContract')
  .addConditionalEdges('fetchContract', (state) => {
    if (state.error) return END
    return 'parseContract'
  })
  .addConditionalEdges('parseContract', (state) => {
    if (state.error) return END
    return 'analyzeContract'
  })
  .addEdge('analyzeContract', END)

export const contractAnalyzer = workflow.compile()

// Helper function to analyze a contract
export async function analyzeContractWithGraph(contractAddress: string) {
  console.log('Starting analysis for contract:', contractAddress)

  const result = await contractAnalyzer.invoke({
    contract_address: contractAddress,
    messages: [],
    contract_text: '',
    parsed_sections: [],
    results: null,
    error: null,
  })

  if (result.error) {
    throw result.error
  }

  console.log('Analysis completed')
  return result.results
}
