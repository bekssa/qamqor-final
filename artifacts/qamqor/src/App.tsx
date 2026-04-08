import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/auth/AuthPage";
import SmsVerifyPage from "@/pages/auth/SmsVerifyPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/auth/verify" component={SmsVerifyPage} />
      <Route path="/auth/forgot" component={ForgotPasswordPage} />
      <Route path="/auth/reset" component={ResetPasswordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider>
          <LanguageProvider>
            <AuthProvider>
              <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
                <Router />
              </WouterRouter>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
