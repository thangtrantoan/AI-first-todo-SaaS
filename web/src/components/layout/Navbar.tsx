import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-brand-600 dark:text-brand-400">TodoSaaS</span>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
              {user.email}
            </span>
          )}
          <ThemeToggle />
          {user && (
            <Button variant="ghost" onClick={handleLogout} className="text-sm">
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
