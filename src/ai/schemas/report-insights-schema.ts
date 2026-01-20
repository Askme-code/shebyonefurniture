import { z } from 'genkit';

export const WeeklySalesSchema = z.object({
  date: z.string(),
  revenue: z.number(),
});

export const OrderStatusSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const CategoryRevenueSchema = z.object({
  name: z.string(),
  revenue: z.number(),
});

export const ReportInsightsInputSchema = z.object({
  weeklySales: z.array(WeeklySalesSchema).describe('Weekly sales data for the last 8 weeks.'),
  orderStatusData: z.array(OrderStatusSchema).describe('Distribution of orders by status.'),
  categoryRevenue: z.array(CategoryRevenueSchema).describe('Revenue breakdown by product category.'),
  totalRevenue: z.number().describe('Total revenue from delivered orders.'),
});
export type ReportInsightsInput = z.infer<typeof ReportInsightsInputSchema>;

export const ReportInsightsOutputSchema = z.string().describe('A concise, bulleted list of business insights and actionable recommendations based on the provided sales data.');
export type ReportInsightsOutput = z.infer<typeof ReportInsightsOutputSchema>;
