'use server';
/**
 * @fileOverview A conversational AI flow for the chatbot.
 *
 * - chat - A function that takes conversation history and a new message, and returns the AI's response.
 */

import { ai } from '@/ai/genkit';
import { products, categories } from '@/lib/data';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from '@/ai/schemas/chat-schema';

// The main function that will be called from the frontend
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

// Create a string representation of all products for the prompt context
const productCatalog = products
  .map(
    (p) => `
  ID: ${p.id}
  Name: ${p.name}
  Description: ${p.description}
  Price: ${p.price} TZS
  Category: ${p.category}
  In Stock: ${p.stock}
  Materials: ${p.materials?.join(', ') || 'N/A'}
  Sizes: ${p.sizes?.join(', ') || 'N/A'}
`
  )
  .join('\n');

const categoryList = categories.map((c) => c.name).join(', ');

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  // Include conversation history using Handlebars `{{#each}}` helper
  prompt: `You are a friendly and helpful customer service chatbot for "Shaaban Furniture Hub", an online furniture store in Zanzibar, Tanzania.
Your goal is to assist users with their questions about products, orders, and the store. Be conversational and welcoming.

Keep your responses concise and to the point.

The store is located in Zanzibar, Tanzania.
The contact phone number is +255 686 587 266 (also available on WhatsApp).
The email is contact@shaabanfurniture.com.
Custom orders can be discussed via WhatsApp.

Here is the store's product catalog:
---
${productCatalog}
---

Available categories: ${categoryList}.

Current conversation:
{{#each history}}
  {{#if (eq role 'user')}}
    User: {{{content}}}
  {{else}}
    You: {{{content}}}
  {{/if}}
{{/each}}

New user message: {{{message}}}

Your response:
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
