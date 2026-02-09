import { BookOpen, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="font-serif text-xl font-bold">Mutola.uz</span>
          </Link>

          <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Ko&apos;rish
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Chiqish
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Kirish
              </Link>
            )}
            <a href="#yangiliklar" className="text-sm font-medium hover:text-primary transition-colors">
              Yangiliklar
            </a>
          </nav>
          </div>
        </div>
      </div>
    </header>
  );
};