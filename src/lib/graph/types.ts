import { BaseMessage } from "@langchain/core/messages";

export interface ContractState {
  messages: BaseMessage[];
  contract_address: string;
  contract_text: string;
  parsed_sections: ParsedSection[];
  results: AnalysisResult;
}

export interface ParsedSection {
  title: string;
  content: string;
}

export interface AnalysisResult {
  program_type: string;
  security_score: number;
  findings: Finding[];
  recommendations: string[];
}

export interface Finding {
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface AnalyzeResponse {
  contract_type: string;
  security_score: number;
  findings: Finding[];
  recommendations: string[];
}
