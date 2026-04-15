import { Switch, Route } from "wouter";
import HomePage from "@pages/home";
import AuthPage from "@pages/auth";
import SmsVerifyPage from "@pages/auth/verify";
import ForgotPasswordPage from "@pages/auth/forgot";
import ResetPasswordPage from "@pages/auth/reset";
import NotFound from "@pages/not-found";

export default function AppRouter() {
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
