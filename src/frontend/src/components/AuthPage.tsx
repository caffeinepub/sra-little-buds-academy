import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import logoImg from "/assets/logo.jpeg";
import {
  useIsEmailRegistered,
  useLoginUser,
  useRegisterUser,
} from "../hooks/useQueries";

const AUTH_USER_KEY = "sra_auth_user";
const WHATSAPP_NUMBER = "919865875567";

type ActiveTab = "login" | "signup";

interface AuthPageProps {
  onLogin: (user: { email: string; name: string }) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");
  const [showForgot, setShowForgot] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSendingForgot, setIsSendingForgot] = useState(false);

  // Mutations
  const registerUser = useRegisterUser();
  const loginUser = useLoginUser();
  const isEmailRegistered = useIsEmailRegistered();

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsCheckingEmail(true);
    try {
      const alreadyRegistered =
        await isEmailRegistered.mutateAsync(signupEmail);
      if (alreadyRegistered) {
        toast.error("This email is already registered. Please log in.");
        return;
      }
      const success = await registerUser.mutateAsync({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      if (success) {
        const user = { email: signupEmail, name: signupName };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        toast.success(
          "Account created! Welcome to SRA Little Buds Academy! 🌸",
        );
        onLogin(user);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const result = await loginUser.mutateAsync({
        email: loginEmail,
        password: loginPassword,
      });
      if (result.success) {
        const user = {
          email: loginEmail,
          name: result.name || loginEmail.split("@")[0],
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        toast.success("Welcome back! 🌸");
        onLogin(user);
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in both password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSendingForgot(true);
    try {
      // Only send details via WhatsApp — no database update
      const msg = `Hello SRA Little Buds Academy,\n\nPassword reset request:\nEmail: ${forgotEmail}\nNew Password: ${newPassword}\n\nPlease update and confirm.`;
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");
      toast.success("Details sent via WhatsApp! Please wait for a response.");
      resetForgotFlow();
      setActiveTab("login");
    } finally {
      setIsSendingForgot(false);
    }
  };

  const resetForgotFlow = () => {
    setShowForgot(false);
    setForgotEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPass(false);
    setShowConfirmPass(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.97 0.018 88) 0%, oklch(0.94 0.04 87) 40%, oklch(0.95 0.03 218) 100%)",
      }}
    >
      {/* Background doodles */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="150" r="60" fill="oklch(0.91 0.11 87)" />
        <circle cx="1100" cy="650" r="80" fill="oklch(0.90 0.055 218)" />
        <circle cx="1050" cy="120" r="45" fill="oklch(0.88 0.07 10)" />
        <circle cx="150" cy="680" r="55" fill="oklch(0.89 0.065 148)" />
        <polygon
          points="950,200 962,236 1000,236 970,258 982,294 950,272 918,294 930,258 900,236 938,236"
          fill="oklch(0.91 0.11 87)"
          opacity="0.6"
        />
        <polygon
          points="250,500 260,530 290,530 267,548 275,578 250,560 225,578 233,548 210,530 240,530"
          fill="oklch(0.88 0.07 10)"
          opacity="0.5"
        />
        <ellipse
          cx="600"
          cy="50"
          rx="120"
          ry="30"
          fill="oklch(0.90 0.055 218)"
          opacity="0.4"
        />
        <ellipse
          cx="600"
          cy="760"
          rx="120"
          ry="30"
          fill="oklch(0.89 0.065 148)"
          opacity="0.4"
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src={logoImg}
              alt="SRA Little Buds Academy"
              className="h-14 w-auto rounded-xl shadow-sm"
            />
          </div>
          <h1 className="text-2xl font-black text-foreground">
            SRA Little Buds Academy
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Nurturing Young Minds 🌸
          </p>
        </div>

        <Card className="shadow-elevated border-border rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {showForgot ? (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        type="button"
                        onClick={resetForgotFlow}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors"
                        data-ocid="auth.link"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className="text-xl font-black">
                          Forgot Password 🔑
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Enter your email and a new password — details will be
                          sent via WhatsApp
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="forgot-email"
                          className="font-semibold text-sm"
                        >
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="your@email.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="pl-9 rounded-xl"
                            data-ocid="auth.input"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="new-password"
                          className="font-semibold text-sm"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="new-password"
                            type={showNewPass ? "text" : "password"}
                            placeholder="New password (min. 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-9 pr-9 rounded-xl"
                            autoComplete="new-password"
                            data-ocid="auth.input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showNewPass ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="confirm-password"
                          className="font-semibold text-sm"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type={showConfirmPass ? "text" : "password"}
                            placeholder="Re-enter your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-9 pr-9 rounded-xl"
                            autoComplete="new-password"
                            data-ocid="auth.input"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showConfirmPass ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {confirmPassword && (
                          <p
                            className="text-xs font-semibold"
                            style={{
                              color:
                                newPassword === confirmPassword
                                  ? "oklch(0.55 0.14 148)"
                                  : "oklch(0.55 0.2 27)",
                            }}
                          >
                            {newPassword === confirmPassword
                              ? "✓ Passwords match"
                              : "✗ Passwords do not match"}
                          </p>
                        )}
                      </div>

                      {/* WhatsApp notice */}
                      <div
                        className="rounded-xl p-3 text-sm"
                        style={{
                          background: "oklch(0.96 0.05 148 / 0.4)",
                          border: "1px solid oklch(0.85 0.1 148)",
                          color: "oklch(0.40 0.12 148)",
                        }}
                      >
                        📲 When you submit, your details will be sent via
                        WhatsApp to the school admin. Please wait for their
                        response.
                      </div>

                      <Button
                        type="submit"
                        disabled={
                          isSendingForgot ||
                          newPassword !== confirmPassword ||
                          !newPassword ||
                          !forgotEmail
                        }
                        className="w-full rounded-full font-bold h-11"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.78 0.14 62), oklch(0.85 0.13 80))",
                          color: "oklch(0.15 0 0)",
                        }}
                        data-ocid="auth.submit_button"
                      >
                        {isSendingForgot ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Submit via WhatsApp"
                        )}
                      </Button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-tabs"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as ActiveTab)}
                  >
                    <TabsList className="w-full rounded-none border-b border-border bg-muted/50 h-14">
                      <TabsTrigger
                        value="login"
                        className="flex-1 font-bold text-base rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                        data-ocid="auth.tab"
                      >
                        Login
                      </TabsTrigger>
                      <TabsTrigger
                        value="signup"
                        className="flex-1 font-bold text-base rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                        data-ocid="auth.tab"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login" className="mt-0">
                      <div className="p-7">
                        <CardHeader className="p-0 mb-6">
                          <CardTitle className="text-xl font-black">
                            Welcome back! 👋
                          </CardTitle>
                          <CardDescription>
                            Sign in to your account
                          </CardDescription>
                        </CardHeader>
                        <form
                          onSubmit={handleLoginSubmit}
                          className="space-y-4"
                          data-ocid="auth.dialog"
                        >
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="login-email"
                              className="font-semibold text-sm"
                            >
                              Email Address
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="login-email"
                                type="email"
                                placeholder="your@email.com"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="pl-9 rounded-xl"
                                autoComplete="email"
                                data-ocid="auth.input"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor="login-password"
                              className="font-semibold text-sm"
                            >
                              Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="login-password"
                                type={showLoginPass ? "text" : "password"}
                                placeholder="Your password"
                                value={loginPassword}
                                onChange={(e) =>
                                  setLoginPassword(e.target.value)
                                }
                                className="pl-9 pr-9 rounded-xl"
                                autoComplete="current-password"
                                data-ocid="auth.input"
                              />
                              <button
                                type="button"
                                onClick={() => setShowLoginPass((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                              >
                                {showLoginPass ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setShowForgot(true)}
                              className="text-sm font-semibold text-primary hover:underline"
                              data-ocid="auth.link"
                            >
                              Forgot Password?
                            </button>
                          </div>

                          <Button
                            type="submit"
                            disabled={loginUser.isPending}
                            className="w-full rounded-full font-bold h-11"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.78 0.14 62), oklch(0.85 0.13 80))",
                              color: "oklch(0.15 0 0)",
                            }}
                            data-ocid="auth.submit_button"
                          >
                            {loginUser.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </Button>
                        </form>
                      </div>
                    </TabsContent>

                    {/* Signup Tab */}
                    <TabsContent value="signup" className="mt-0">
                      <div className="p-7">
                        <CardHeader className="p-0 mb-6">
                          <CardTitle className="text-xl font-black">
                            Create Account 🌱
                          </CardTitle>
                          <CardDescription>
                            Join SRA Little Buds Academy
                          </CardDescription>
                        </CardHeader>
                        <form
                          onSubmit={handleSignupSubmit}
                          className="space-y-4"
                          data-ocid="auth.dialog"
                        >
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="signup-name"
                              className="font-semibold text-sm"
                            >
                              Full Name
                            </Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="signup-name"
                                type="text"
                                placeholder="Your full name"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                className="pl-9 rounded-xl"
                                data-ocid="auth.input"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor="signup-email"
                              className="font-semibold text-sm"
                            >
                              Email Address
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="signup-email"
                                type="email"
                                placeholder="your@email.com"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className="pl-9 rounded-xl"
                                autoComplete="email"
                                data-ocid="auth.input"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor="signup-password"
                              className="font-semibold text-sm"
                            >
                              Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="signup-password"
                                type={showSignupPass ? "text" : "password"}
                                placeholder="Create a password (min. 6 chars)"
                                value={signupPassword}
                                onChange={(e) =>
                                  setSignupPassword(e.target.value)
                                }
                                className="pl-9 pr-9 rounded-xl"
                                autoComplete="new-password"
                                data-ocid="auth.input"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignupPass((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                              >
                                {showSignupPass ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            disabled={
                              isCheckingEmail ||
                              registerUser.isPending ||
                              isEmailRegistered.isPending
                            }
                            className="w-full rounded-full font-bold h-11"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.78 0.14 62), oklch(0.85 0.13 80))",
                              color: "oklch(0.15 0 0)",
                            }}
                            data-ocid="auth.submit_button"
                          >
                            {isCheckingEmail || registerUser.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </form>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-5">
          © {new Date().getFullYear()} SRA Little Buds Academy · Built with love
          using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
