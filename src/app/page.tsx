"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileText, HelpCircle, Info, Loader2, PenSquare, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { seoAudit } from "@/ai/flows/seo-audit";
import type { SeoAuditOutput } from "@/ai/flows/seo-audit";
import { rewriteContent } from "@/ai/flows/content-rewriter";
import type { RewriteContentOutput } from "@/ai/flows/content-rewriter";
import { faqGenerator } from "@/ai/flows/faq-generator";
import type { FaqGeneratorOutput } from "@/ai/flows/faq-generator";
import { generateMetaInfo } from "@/ai/flows/meta-info-generator";
import type { MetaInfoOutput } from "@/ai/flows/meta-info-generator";
import { GeminiSeoLogo } from "@/components/gemini-seo-logo";
import { OutputDisplay, type AnalysisType, type OutputData } from "@/components/output-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }).max(10000, {
    message: "Content must not be longer than 10,000 characters.",
  }),
  analysisType: z.enum(["audit", "rewrite", "faq", "meta"]),
});

type FormValues = z.infer<typeof formSchema>;

const analysisOptions = [
  { value: 'audit', label: 'SEO Audit', icon: FileText },
  { value: 'rewrite', label: 'Content Rewrite', icon: PenSquare },
  { value: 'faq', label: 'FAQ Generation', icon: HelpCircle },
  { value: 'meta', label: 'Meta Info Generator', icon: Info },
];

export default function Home() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<OutputData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType>('audit');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      analysisType: "audit",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setOutput(null);
    setError(null);
    try {
      let result: OutputData;
      const input = { content: values.content };
      switch (values.analysisType) {
        case "audit":
          result = await seoAudit(input);
          break;
        case "rewrite":
          result = await rewriteContent(input);
          break;
        case "faq":
          result = await faqGenerator(input);
          break;
        case "meta":
          result = await generateMetaInfo(input);
          break;
        default:
          throw new Error("Invalid analysis type");
      }
      setOutput(result);
      setSelectedAnalysisType(values.analysisType as AnalysisType);
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8">
      <header className="flex items-center gap-4 mb-8">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">AI Powered SEO with Md Obaidul Haque</h1>
          <p className="text-muted-foreground"></p>
        </div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Content Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="analysisType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Analysis Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an analysis type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {analysisOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2">
                                <opt.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{opt.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your content here for SEO analysis..."
                          className="min-h-[300px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>AI Generated Output</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {isLoading && (
              <div className="space-y-4 pt-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <br/>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            )}
            {!isLoading && error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && !output && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <div className="p-6 rounded-full bg-secondary mb-4">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Ready to Optimize</h3>
                <p className="max-w-xs">Your AI-generated SEO suggestions will appear here once you provide content and run an analysis.</p>
              </div>
            )}
            {!isLoading && !error && output && (
              <OutputDisplay analysisType={selectedAnalysisType} data={output} />
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>This Project Work by Gemini API. Built with Next.js and Genkit.</p>
        <p className="text-2xl font-bold mt-4">
          Made With 💔{" "}
          <a
            href="https://md-obaidul-haque0011.web.app/"
            style={{ color: "blue" }}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Md Obaidul Haque
          </a>
        </p>
      </footer>
    </div>
  );
}
