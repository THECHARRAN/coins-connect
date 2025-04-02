
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Failed to log out:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging you out.",
      });
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-finance-primary">💰 MindYourMoney</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {currentUser && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-finance-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/transactions" className="text-gray-600 hover:text-finance-primary transition-colors">
                Transactions
              </Link>
              <Link to="/budgets" className="text-gray-600 hover:text-finance-primary transition-colors">
                Budgets
              </Link>
              <Link to="/goals" className="text-gray-600 hover:text-finance-primary transition-colors">
                Goals
              </Link>
              <Link to="/reports" className="text-gray-600 hover:text-finance-primary transition-colors">
                Reports
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium hidden md:inline-block">
                {currentUser.displayName || currentUser.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
