import { useState, FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { checkAuth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Login va parolni kiriting");
      return;
    }
    if (!checkAuth(username.trim(), password)) {
      setError("Login yoki parol noto‘g‘ri");
      return;
    }
    login();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-xl bg-primary/10 w-fit mb-2">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Mutola.uz</CardTitle>
            <CardDescription>Dashboardga kirish</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Login</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  autoComplete="username"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <Button type="submit" className="w-full" size="lg">
                <LogIn className="h-4 w-4 mr-2" />
                Kirish
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              <Link to="/" className="hover:text-primary underline">
                Bosh sahifaga qaytish
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
