import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-border/50">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                <h2 className="text-4xl font-bold">Get in Touch</h2>
              </div>
              <p className="text-muted-foreground">
                Feel free to reach out for collaboration or just a friendly hello
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">📧</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-muted-foreground">Azeemjameel4280@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">📱</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-muted-foreground">+91 7668341151</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">📍</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-muted-foreground">Ghaziabad, India</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Connect With Me</h4>
                  <div className="flex space-x-4">
                    <Button size="icon" variant="outline" className="rounded-full">
                      <span className="text-xl">🔗</span>
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full">
                      <span className="text-xl">📘</span>
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full">
                      <span className="text-xl">📷</span>
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full">
                      <span className="text-xl">🐦</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="min-h-32 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    size="lg"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};