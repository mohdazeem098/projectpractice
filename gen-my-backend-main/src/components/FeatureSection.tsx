import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Advanced NLP Algorithms",
    description: "Powered by state-of-the-art natural language processing technology to produce precise and coherent summaries.",
    icon: "🧠"
  },
  {
    title: "Fast & Efficient", 
    description: "Get instant summaries of lengthy articles or documents without sacrificing accuracy or context.",
    icon: "⚡"
  },
  {
    title: "Supports Multiple Formats",
    description: "Summarizes from web articles, PDFs, and various text files to fit all your content needs seamlessly.",
    icon: "📄"
  }
];

export const FeatureSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Features</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};