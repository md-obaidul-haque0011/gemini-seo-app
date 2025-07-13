'use server';

/**
 * @fileOverview An AI agent for generating SEO-optimized meta titles and descriptions.
 *
 * - generateMetaInfo - A function that generates meta titles and descriptions.
 * - MetaInfoInput - The input type for the generateMetaInfo function.
 * - MetaInfoOutput - The return type for the generateMetaInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MetaInfoInputSchema = z.object({
  content: z.string().describe('The content to generate meta information for.'),
});
export type MetaInfoInput = z.infer<typeof MetaInfoInputSchema>;

const MetaInfoOutputSchema = z.object({
  title: z.string().describe('The SEO-optimized meta title.'),
  description: z.string().describe('The SEO-optimized meta description.'),
});
export type MetaInfoOutput = z.infer<typeof MetaInfoOutputSchema>;

export async function generateMetaInfo(input: MetaInfoInput): Promise<MetaInfoOutput> {
  return generateMetaInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'metaInfoGeneratorPrompt',
  input: {schema: MetaInfoInputSchema},
  output: {schema: MetaInfoOutputSchema},
  prompt: `You are an SEO expert, skilled in crafting compelling meta titles and descriptions that drive traffic from search engines, following Google's 2026 SEO guidelines.

  Based on the following content, generate an SEO-optimized meta title and description. The title should be concise (under 60 characters) and the description should be informative (under 160 characters).

  Content: {{{content}}}
  
  Ensure the generated title and description are engaging, relevant, and accurately represent the content.
  `,
});

const generateMetaInfoFlow = ai.defineFlow(
  {
    name: 'metaInfoGeneratorFlow',
    inputSchema: MetaInfoInputSchema,
    outputSchema: MetaInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
