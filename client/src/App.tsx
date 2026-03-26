import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import AutoQuotePage from "@/pages/auto-quote";
import HomeQuotePage from "@/pages/home-quote";
import LifeQuotePage from "@/pages/life-quote";
import { ChatWidget } from "@/components/ChatWidget";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auto-quote" component={AutoQuotePage} />
      <Route path="/home-quote" component={HomeQuotePage} />
      <Route path="/life-quote" component={LifeQuotePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router hook={useHashLocation}>
          <AppRouter />
          <ChatWidget />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
