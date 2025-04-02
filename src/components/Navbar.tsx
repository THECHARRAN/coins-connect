
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, LineChart, PiggyBank, BarChart3, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-1.5 ${isActive('/dashboard') ? 'text-finance-primary font-medium' : 'text-gray-600 hover:text-finance-primary'} transition-colors`}
              >
                <LineChart className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                to="/transactions" 
                className={`flex items-center gap-1.5 ${isActive('/transactions') ? 'text-finance-primary font-medium' : 'text-gray-600 hover:text-finance-primary'} transition-colors`}
              >
                <CreditCard className="h-4 w-4" />
                Transactions
              </Link>
              <Link 
                to="/budgets" 
                className={`flex items-center gap-1.5 ${isActive('/budgets') ? 'text-finance-primary font-medium' : 'text-gray-600 hover:text-finance-primary'} transition-colors`}
              >
                <BarChart3 className="h-4 w-4" />
                Budgets
              </Link>
              <Link 
                to="/goals" 
                className={`flex items-center gap-1.5 ${isActive('/goals') ? 'text-finance-primary font-medium' : 'text-gray-600 hover:text-finance-primary'} transition-colors`}
              >
                <PiggyBank className="h-4 w-4" />
                Goals
              </Link>
            </>
          )}
          <Link 
            to="/profile" 
            className={`flex items-center gap-1.5 ${isActive('/profile') ? 'text-finance-primary font-medium' : 'text-gray-600 hover:text-finance-primary'} transition-colors`}
          >
            <User className="h-4 w-4" />
            About Us
          </Link>
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
