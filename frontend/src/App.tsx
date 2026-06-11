import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ChatContextProvider } from "@/contexts/ChatContext";
import { ChatBot } from "@/components/ChatBot";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Upload from "@/pages/upload";
import Results from "@/pages/results";
import Example from "@/pages/example";
import Pricing from "@/pages/pricing";
import Checkout from "@/pages/checkout";
import About from "@/pages/about";
import BuildLog from "@/pages/build-log";
import HowItWorks from "@/pages/how-it-works";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Resources from "@/pages/resources";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/upload" component={Upload} />
      <Route path="/results/:id" component={Results} />
      <Route path="/results" component={Results} />
      <Route path="/example" component={Example} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/about" component={About} />
      <Route path="/build-log" component={BuildLog} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/resources" component={Resources} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ChatContextProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <ChatBot />
          </TooltipProvider>
        </QueryClientProvider>
      </ChatContextProvider>
    </LanguageProvider>
  );
}

export default App;
