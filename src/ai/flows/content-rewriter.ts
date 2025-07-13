// src/ai/flows/content-rewriter.ts
'use server';

/**
 * @fileOverview A content rewriter AI agent.
 *
 * - rewriteContent - A function that handles the content rewriting process.
 * - RewriteContentInput - The input type for the rewriteContent function.
 * - RewriteContentOutput - The return type for the rewriteContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteContentInputSchema = z.object({
  content: z
    .string()
    .describe('The content to be rewritten for better SEO and user engagement.'),
});
export type RewriteContentInput = z.infer<typeof RewriteContentInputSchema>;

const RewriteContentOutputSchema = z.object({
  rewrittenContent: z
    .string()
    .describe('The rewritten content, optimized for SEO and user engagement.'),
});
export type RewriteContentOutput = z.infer<typeof RewriteContentOutputSchema>;

export async function rewriteContent(input: RewriteContentInput): Promise<RewriteContentOutput> {
  return rewriteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteContentPrompt',
  input: {schema: RewriteContentInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are an expert SEO content writer specializing in rewriting content to be more engaging and SEO-friendly, adhering to Helpful Content guidelines.

  Rewrite the following content to be more engaging and SEO-friendly:

  Content: {{{content}}}`,
});

const rewriteContentFlow = ai.defineFlow(
  {
    name: 'rewriteContentFlow',
    inputSchema: RewriteContentInputSchema,
    outputSchema: RewriteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
