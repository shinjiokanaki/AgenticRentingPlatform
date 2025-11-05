import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Home, Search, MessageSquare, User, Menu, Heart, Users } from "lucide-react";
import HomePage from "@/pages/HomePage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import OnboardingPage from "@/pages/OnboardingPage";
import MessagesPage from "@/pages/MessagesPage";
import ScoutModePage from "@/pages/ScoutModePage";
import MatchesPage from "@/pages/MatchesPage";
import LandlordOnboardingPage from "@/pages/LandlordOnboardingPage";
import LandlordDashboardPage from "@/pages/LandlordDashboardPage";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/property/1", icon: Search, label: "Properties" },
    { path: "/matches", icon: Heart, label: "Matches" },
    { path: "/scout", icon: Users, label: "Scout" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/onboarding", icon: User, label: "Profile" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold flex items-center gap-2" data-testid="link-logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            RentMatch
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="gap-2"
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/property/:id" component={PropertyDetailPage} />
      <Route path="/matches" component={MatchesPage} />
      <Route path="/scout" component={ScoutModePage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/landlord/onboarding" component={LandlordOnboardingPage} />
      <Route path="/landlord/dashboard" component={LandlordDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Navigation />
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
