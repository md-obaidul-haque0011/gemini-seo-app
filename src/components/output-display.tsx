"use client";

import { useState } from 'react';
import type { SeoAuditOutput } from "@/ai/flows/seo-audit";
import type { RewriteContentOutput } from "@/ai/flows/content-rewriter";
import type { FaqGeneratorOutput } from "@/ai/flows/faq-generator";
import type { MetaInfoOutput } from "@/ai/flows/meta-info-generator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AnalysisType = 'audit' | 'rewrite' | 'faq' | 'meta';
export type OutputData = SeoAuditOutput | RewriteContentOutput | FaqGeneratorOutput | MetaInfoOutput;

interface OutputDisplayProps {
  analysisType: AnalysisType;
  data: OutputData | null;
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={onCopy} className="h-7 w-7">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function OutputDisplay({ analysisType, data }: OutputDisplayProps) {
  if (!data) return null;

  switch (analysisType) {
    case 'audit':
      const auditData = data as SeoAuditOutput;
      return (
        <div className="prose">
          <p>{auditData.report}</p>
        </div>
      );

    case 'rewrite':
      const rewriteData = data as RewriteContentOutput;
      return (
        <Card>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle>Rewritten Content</CardTitle>
              <CopyButton textToCopy={rewriteData.rewrittenContent} />
            </div>
          </CardHeader>
          <CardContent className="prose">
            <p>{rewriteData.rewrittenContent}</p>
          </CardContent>
        </Card>
      );

    case 'faq':
      const faqData = data as FaqGeneratorOutput;
      return (
        <Accordion type="single" collapsible className="w-full">
          {faqData.faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="prose">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );

    case 'meta':
      const metaData = data as MetaInfoOutput;
      return (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="meta-title">Meta Title</Label>
              <CopyButton textToCopy={metaData.title} />
            </div>
            <Input id="meta-title" readOnly value={metaData.title} />
            <p className={cn("text-sm text-muted-foreground mt-1", metaData.title.length > 60 ? "text-destructive" : "")}>
              {metaData.title.length} / 60 characters
            </p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="meta-description">Meta Description</Label>
              <CopyButton textToCopy={metaData.description} />
            </div>
            <Textarea id="meta-description" readOnly value={metaData.description} className="h-24 resize-none" />
            <p className={cn("text-sm text-muted-foreground mt-1", metaData.description.length > 160 ? "text-destructive" : "")}>
              {metaData.description.length} / 160 characters
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div>
          <h3 className="font-semibold">Unsupported analysis type</h3>
          <p>The selected analysis type does not have a display component.</p>
        </div>
      );
  }
}
