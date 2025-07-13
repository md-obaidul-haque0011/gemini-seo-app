'use server';

/**
 * @fileOverview FAQ Generator AI agent.
 *
 * - faqGenerator - A function that handles the FAQ generation process.
 * - FaqGeneratorInput - The input type for the faqGenerator function.
 * - FaqGeneratorOutput - The return type for the faqGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaqGeneratorInputSchema = z.object({
  content: z.string().describe('The content to generate FAQs from.'),
});
export type FaqGeneratorInput = z.infer<typeof FaqGeneratorInputSchema>;

const FaqGeneratorOutputSchema = z.object({
  faqs: z.array(
    z.object({
      question: z.string().describe('The FAQ question.'),
      answer: z.string().describe('The answer to the FAQ question.'),
    })
  ).describe('The generated FAQs.'),
});
export type FaqGeneratorOutput = z.infer<typeof FaqGeneratorOutputSchema>;

export async function faqGenerator(input: FaqGeneratorInput): Promise<FaqGeneratorOutput> {
  return faqGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqGeneratorPrompt',
  input: {schema: FaqGeneratorInputSchema},
  output: {schema: FaqGeneratorOutputSchema},
  prompt: `You are an expert SEO content creator.

  Based on the following content, generate a list of frequently asked questions and their answers.
  The questions should be relevant to the content and address common user queries.

  Content: {{{content}}}
  `,
});

const faqGeneratorFlow = ai.defineFlow(
  {
    name: 'faqGeneratorFlow',
    inputSchema: FaqGeneratorInputSchema,
    outputSchema: FaqGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
