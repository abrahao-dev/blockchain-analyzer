# Blockchain Asset Analyzer - Project Context

## Project Overview
AI-powered smart contract analyzer using LangGraph for orchestrated analysis workflows.

## Project Structure

bash
blockchain-analyzer/
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ └── analyze/
│ │ ├── globals.css # Contains Web3 themed Tailwind styles
│ │ └── page.tsx # Main page with contract input
│ ├── components/
│ │ ├── layout/
│ │ │ └── Layout.tsx # Main layout component
│ │ └── ui/

## Setup Commands

Create new Next.js project
npx create-next-app@latest blockchain-analyzer --typescript --tailwind --eslint
cd blockchain-analyzer
Install dependencies
npm install @langchain/core langchain graphlib @types/graphlib openai dotenv
npm install @heroicons/react framer-motion

## Dependencies
- Next.js with TypeScript
- Tailwind CSS
- @langchain/core
- langchain
- graphlib
- @types/graphlib
- openai
- dotenv
- @heroicons/react
- framer-motion

## Color Scheme

css
:root {
--primary: #6366f1;
--secondary: #8b5cf6;
--accent-1: #3b82f6;
--accent-2: #2563eb;
--accent-3: #7c3aed;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--background: #0a0a0f;
--foreground: #ffffff;
--card: rgba(17, 24, 39, 0.7);
--border: rgba(255, 255, 255, 0.1);
}


## Core Types

typescript
interface ContractState {
contract_text?: string;
parsed_sections?: ParsedSection[];
query?: string;
results?: AnalyzeResponse;
}
interface ParsedSection {
title: string;
content: string;
}
interface AnalyzeResponse {
contract_type: string;
security_score: number;
findings: Finding[];
recommendations: string[];
}
interface Finding {
category: string;
severity: 'low' | 'medium' | 'high';
description: string;
}
Component
typescript
interface LayoutProps {
children: ReactNode
}
const Layout: FC<LayoutProps> = ({ children }) => {
return (
<div className="min-h-screen">
<main className="container py-8">
{children}
</main>
</div>
)
}
:
env
OPENAI_API_KEY=your_key_here
design
You can save this as context.md in your project root. This will serve as a comprehensive reference for continuing development from any point. Would you like me to help you implement any specific part next?

## Utility Classes
- `.glass` - Frosted glass effect with backdrop blur
- `.container` - Consistent padding and max width
- `.input-area` - Styled input sections
- `.button-primary` - Gradient background buttons
- `.textarea-primary` - Code input areas
- `.gradient-text` - Text with gradient effect

## Environment Setup
Create a `.env.local` file:


## Next Steps

### 1. LangGraph Implementation
- Contract parsing node
- Analysis node
- Search functionality
- State management

### 2. UI Components
- Analysis results display
- Loading states
- Error handling
- Contract visualization

### 3. API Routes
- /api/analyze endpoint
- Contract validation
- Rate limiting
- Error handling

### 4. Features
- Contract type detection
- Security analysis
- Vulnerability scanning
- Recommendations generation

## Notes
- Project uses a clean, minimalist Web3 UI/UX
- Dark theme with glass morphism effects
- Gradient accents for visual hierarchy
- Mobile-responsive design