'use server';
/**
 * @fileOverview An AI flow to generate business insights from sales reports.
 *
 * - generateReportInsights - A function that takes sales data and returns AI-powered analysis.
 */

import { ai } from '@/ai/genkit';
import { ReportInsightsInputSchema, ReportInsightsOutputSchema, type ReportInsightsInput, type ReportInsightsOutput } from '@/ai/schemas/report-insights-schema';

export async function generateReportInsights(input: ReportInsightsInput): Promise<ReportInsightsOutput> {
  return reportInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reportInsightsPrompt',
  input: { schema: ReportInsightsInputSchema },
  output: { schema: ReportInsightsOutputSchema },
  prompt: `You are a business intelligence analyst for an online furniture store. Your task is to analyze the following sales data and provide actionable insights.

The currency is Tanzanian Shillings (TZS).

**Data Overview:**
- Total Revenue (from delivered orders): {{{totalRevenue}}} TZS
- Weekly Sales (last 8 weeks): {{json weeklySales}}
- Order Status Distribution: {{json orderStatusData}}
- Revenue by Category: {{json categoryRevenue}}

**Analysis Task:**
Based on the data provided, generate a concise, bulleted list of key insights and actionable recommendations. Each point should start with a \`*\`. Focus on:
- Sales trends (e.g., growth, decline).
- Top-performing categories and potential opportunities.
- Order fulfillment efficiency (based on status distribution).
- Suggestions for marketing, inventory management, or product strategy.

Keep the insights clear and easy to understand for a business owner.
`,
});

const reportInsightsFlow = ai.defineFlow(
  {
    name: 'reportInsightsFlow',
    inputSchema: ReportInsightsInputSchema,
    outputSchema: ReportInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || "AI insights could not be generated at this time. Please try again later.";
  }
);
