import { config } from 'dotenv';
config();

import '@/ai/flows/seo-audit.ts';
import '@/ai/flows/meta-info-generator.ts';
import '@/ai/flows/content-rewriter.ts';
import '@/ai/flows/faq-generator.ts';