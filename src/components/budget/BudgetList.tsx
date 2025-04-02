
import React from 'react';
import { Budget, CATEGORIES } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { deleteBudget } from '@/services/budgetService';

interface BudgetListProps {
  budgets: Budget[];
  expenses: Record<string, number>;
  onBudgetDeleted: () => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ 
  budgets, 
  expenses,
  onBudgetDeleted
}) => {
  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budgets</CardTitle>
          <CardDescription>You haven't created any budgets yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          Create a budget to track your spending by category
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      toast.success("Budget deleted successfully");
      onBudgetDeleted();
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Budgets</CardTitle>
        <CardDescription>Track your spending against your budgets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {budgets.map((budget) => {
          const category = CATEGORIES.find(c => c.value === budget.category);
          const spent = expenses[budget.category] || 0;
          const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
          const isWarning = percentage >= 80 && percentage < 100;
          const isExceeded = percentage >= 100;
          
          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category?.icon}</span>
                  <span className="font-medium">{category?.label}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(budget.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <Progress 
                value={percentage} 
                className={`${isExceeded ? 'bg-red-200' : isWarning ? 'bg-amber-200' : 'bg-slate-200'}`}
              />
              
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">${spent.toFixed(2)}</span>
                  <span className="text-muted-foreground"> spent</span>
                </div>
                <div>
                  <span className={`font-medium ${isExceeded ? 'text-red-500' : isWarning ? 'text-amber-500' : ''}`}>
                    ${budget.amount.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground"> budget ({budget.period})</span>
                </div>
              </div>
              
              <div className="text-right text-sm">
                {isExceeded ? (
                  <span className="text-red-500 font-medium">Budget exceeded!</span>
                ) : isWarning ? (
                  <span className="text-amber-500 font-medium">Getting close to budget limit!</span>
                ) : (
                  <span className="text-green-500 font-medium">{100 - percentage}% remaining</span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BudgetList;
