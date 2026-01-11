import { z } from 'genkit';

const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  });
  
  export const ChatInputSchema = z.object({
    history: z.array(ChatMessageSchema).describe('The conversation history.'),
    message: z.string().describe('The latest user message.'),
  });
  export type ChatInput = z.infer<typeof ChatInputSchema>;
  
  export const ChatOutputSchema = z.string().describe("The model's response.");
  export type ChatOutput = z.infer<typeof ChatOutputSchema>;
  