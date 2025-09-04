import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Limited usage for casual users, up to 5 articles summarized per week.",
    features: [
      "5 summaries per week",
      "Basic summarization",
      "Standard processing speed",
      "Email support"
    ],
    popular: false,
    gradient: "from-slate-900 to-slate-700"
  },
  {
    name: "Pro", 
    price: "$4/month",
    description: "Unlimited article summarization, priority processing, and advanced features.",
    features: [
      "Unlimited summaries",
      "Advanced AI models",
      "Priority processing", 
      "Multiple export formats",
      "API access",
      "24/7 priority support"
    ],
    popular: true,
    gradient: "from-blue-900 to-purple-900"
  },
  {
    name: "Enterprise",
    price: "Contact us",
    description: "Custom solutions designed for teams and organizations with large-scale needs.",
    features: [
      "Custom usage limits",
      "Dedicated infrastructure",
      "White-label solution",
      "Advanced analytics",
      "SSO integration",
      "Dedicated account manager"
    ],
    popular: false,
    gradient: "from-orange-900 to-red-900"
  }
];

export const PricingSection = () => {
  const { toast } = useToast();

  const handleSubscribe = (plan: string) => {
    toast({
      title: `${plan} Plan Selected`,
      description: `Redirecting to payment for ${plan} plan...`,
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Pricing</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-gradient-to-br ${plan.gradient} text-white border-0 hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'scale-105 ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-2">
                    {plan.name === "Basic" ? "🔹" : plan.name === "Pro" ? "💎" : "🏢"}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-2">{plan.price}</div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleSubscribe(plan.name)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  size="lg"
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};