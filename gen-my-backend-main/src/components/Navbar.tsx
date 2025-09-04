import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/components/AuthProvider";

export const Navbar = () => {
  const { toast } = useToast();
  const { user, signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            <span className="text-foreground">CRUXLY</span>{" "}
            <span className="text-primary">AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            FOUNDER & CEO <span className="text-destructive font-semibold">AZEEM</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Home
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Feature
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Pricing
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Contact
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="text-sm text-muted-foreground">
                {profile?.subscription_tier === 'free' && (
                  <span>Free: {profile?.daily_usage || 0}/5 today</span>
                )}
                {profile?.subscription_tier === 'pro' && (
                  <span className="text-primary font-medium">Pro User</span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <AuthDialog>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </AuthDialog>
              <AuthDialog>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  Get Started
                </Button>
              </AuthDialog>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};