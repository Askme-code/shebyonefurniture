import {z} from 'genkit';

export const PersonalizedRecommendationsInputSchema = z.object({
  viewedProductIds: z.array(z.string()).describe('The IDs of the products the user has recently viewed.'),
  cartProductIds: z.array(z.string()).describe('The IDs of the products currently in the user\'s cart.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

export const PersonalizedRecommendationsOutputSchema = z.array(z.string()).describe('An array of product IDs representing personalized furniture recommendations.');
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;
