// src/ai/flows/seo-audit.ts
'use server';

/**
 * @fileOverview An SEO Audit AI agent.
 *
 * - seoAudit - A function that handles the SEO audit process.
 * - SeoAuditInput - The input type for the seoAudit function.
 * - SeoAuditOutput - The return type for the seoAudit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SeoAuditInputSchema = z.object({
  content: z
    .string()
    .describe("The content to be audited for SEO optimization."),
});
export type SeoAuditInput = z.infer<typeof SeoAuditInputSchema>;

const SeoAuditOutputSchema = z.object({
  report: z.string().describe('A concise SEO audit report highlighting areas for improvement.'),
});
export type SeoAuditOutput = z.infer<typeof SeoAuditOutputSchema>;

export async function seoAudit(input: SeoAuditInput): Promise<SeoAuditOutput> {
  return seoAuditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoAuditPrompt',
  input: {schema: SeoAuditInputSchema},
  output: {schema: SeoAuditOutputSchema},
  prompt: `You are an expert SEO auditor. Please provide a concise SEO audit report for the following content, highlighting areas for improvement, in accordance with Google's 2026 SEO guidelines (EEAT, Helpful Content).\n\nContent: {{{content}}}`,
});

const seoAuditFlow = ai.defineFlow(
  {
    name: 'seoAuditFlow',
    inputSchema: SeoAuditInputSchema,
    outputSchema: SeoAuditOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
