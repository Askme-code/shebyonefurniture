'use server';

/**
 * @fileOverview A personalized furniture recommendation AI agent.
 *
 * - getPersonalizedRecommendations - A function that returns personalized furniture recommendations based on user's viewing history and cart items.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  viewedProductIds: z.array(z.string()).describe('The IDs of the products the user has recently viewed.'),
  cartProductIds: z.array(z.string()).describe('The IDs of the products currently in the user\'s cart.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.array(z.string()).describe('An array of product IDs representing personalized furniture recommendations.');
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert furniture stylist. Based on the products a user has viewed and the products in their cart, recommend other products that match their style.

Viewed Product IDs: {{viewedProductIds}}
Cart Product IDs: {{cartProductIds}}

Return a JSON array of product IDs that would be a good fit for the user. Only suggest product IDs from our existing product catalog, do not invent new IDs.
Products already in the cart or recently viewed should not be included in recommendations.
Consider the user's taste and aesthetic preferences when choosing recommendations, with a focus on products that complement the existing selections.`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
