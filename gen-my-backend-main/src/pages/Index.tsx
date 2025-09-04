import { Navbar } from "@/components/Navbar";
import { SummarizerTool } from "@/components/SummarizerTool";
import { FeatureSection } from "@/components/FeatureSection";
import { PricingSection } from "@/components/PricingSection";
import { ContactSection } from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 space-y-20">
        <SummarizerTool />
        <FeatureSection />
        <PricingSection />
        <ContactSection />
      </main>

      <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 CRUXLY AI. Built with ❤️ by Azeem
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
