import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { AuthDialog } from "@/components/AuthDialog";

export const SummarizerTool = () => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [summaryMode, setSummaryMode] = useState("extractive");
  const [outputFormat, setOutputFormat] = useState("paragraph");
  const [summaryLength, setSummaryLength] = useState("short");
  const [extractKeywords, setExtractKeywords] = useState(false);
  const [showReadingStats, setShowReadingStats] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSummarize = async () => {
    if (!url && !text) {
      toast({
        title: "Input Required",
        description: "Please provide either a URL or paste text to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Call your Supabase edge function
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the summarizer.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          url,
          text,
          mode: summaryMode,
          format: outputFormat,
          length: summaryLength,
          extractKeywords,
          showStats: showReadingStats
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize');
      }

      const data = await response.json();
      setSummary(data.summary);
      setProgress(100);

      toast({
        title: "Summary Generated",
        description: "Your article has been successfully summarized!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Transform lengthy articles into concise summaries
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Boost your productivity and save time by understanding key points instantly with AI-powered summarization.
        </p>
      </div>

      {/* Main Summarizer Tool */}
      <Card className="bg-background/60 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Summarizer</h2>
            
            {/* URL Input */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-12 text-base"
              />
              {user ? (
                <Button 
                  onClick={handleSummarize}
                  disabled={isLoading}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8"
                >
                  {isLoading ? "Summarizing..." : "Summarize"}
                </Button>
              ) : (
                <AuthDialog>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8"
                  >
                    Sign In to Summarize
                  </Button>
                </AuthDialog>
              )}
            </div>

            {/* Sample Links */}
            <div className="text-sm text-muted-foreground mb-8">
              Try sample: 
              <Button variant="link" className="p-0 ml-2 text-primary hover:text-primary/80">
                AI Article
              </Button>
              <Button variant="link" className="p-0 ml-2 text-primary hover:text-primary/80">
                News
              </Button>
              <Button variant="link" className="p-0 ml-2 text-primary hover:text-primary/80">
                Research Paper
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Summary Mode */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <Label className="text-base font-semibold mb-4 block">Summary Mode</Label>
                <RadioGroup value={summaryMode} onValueChange={setSummaryMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extractive" id="extractive" />
                    <Label htmlFor="extractive" className="text-sm">
                      <span className="font-medium text-green-600">Extractive</span>{" "}
                      <span className="text-muted-foreground">(Key sentences)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="abstractive" id="abstractive" />
                    <Label htmlFor="abstractive" className="text-sm">
                      <span className="font-medium text-blue-600">Abstractive</span>{" "}
                      <span className="text-muted-foreground">(AI rewritten)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Output Format */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <Label className="text-base font-semibold mb-4 block">Output Format</Label>
                <RadioGroup value={outputFormat} onValueChange={setOutputFormat}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paragraph" id="paragraph" />
                    <Label htmlFor="paragraph" className="text-sm font-medium text-green-600">
                      Paragraph
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bullet" id="bullet" />
                    <Label htmlFor="bullet" className="text-sm text-muted-foreground">
                      Bullet Points
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Summary Length */}
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <Label className="text-base font-semibold mb-4 block text-card-foreground">
                  Summary Length
                </Label>
                <Select value={summaryLength} onValueChange={setSummaryLength}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (0-100 words)</SelectItem>
                    <SelectItem value="medium">Medium (100-200 words)</SelectItem>
                    <SelectItem value="long">Long (200+ words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Options */}
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <Label className="text-base font-semibold mb-4 block text-card-foreground">
                  Additional Options
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="keywords"
                      checked={extractKeywords}
                      onCheckedChange={(checked) => setExtractKeywords(checked === true)}
                    />
                    <Label htmlFor="keywords" className="text-sm">
                      Extract Keywords
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="stats"
                      checked={showReadingStats}
                      onCheckedChange={(checked) => setShowReadingStats(checked === true)}
                    />
                    <Label htmlFor="stats" className="text-sm text-green-600 font-medium">
                      ✓ Show Reading Stats
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Input Alternative */}
          <div className="mb-6">
            <Label className="text-base font-semibold mb-2 block">Or paste your text here:</Label>
            <Textarea
              placeholder="Paste your article text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 resize-none"
            />
          </div>

          {/* Summary Output */}
          {summary && (
            <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <p className="text-foreground leading-relaxed">{summary}</p>
              
              {showReadingStats && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Original: ~2,450 words</span>
                    <span>Summary: ~156 words</span>
                    <span>Compression: 94%</span>
                    <span>Reading time saved: ~8 minutes</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};