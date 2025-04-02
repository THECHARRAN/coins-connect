
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getBudgets } from "@/services/budgetService";
import { getTransactions } from "@/services/transactionService";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetList from "@/components/budget/BudgetList";
import { Budget, Category } from "@/types";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { startOfMonth, endOfMonth } from "date-fns";

const Budgets: React.FC = () => {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Get budgets
      const fetchedBudgets = await getBudgets(currentUser.uid);
      setBudgets(fetchedBudgets);
      
      // Get transactions for the current month
      const startDate = startOfMonth(new Date());
      const endDate = endOfMonth(new Date());
      
      const transactions = await getTransactions(currentUser.uid);
      const filteredTransactions = transactions.filter(t => 
        t.type === 'expense' &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
      );
      
      // Calculate expenses by category
      const expenses: Record<string, number> = {};
      filteredTransactions.forEach(transaction => {
        const { category, amount } = transaction;
        expenses[category] = (expenses[category] || 0) + amount;
      });
      
      setExpensesByCategory(expenses);
      
      // Prepare chart data
      const data = fetchedBudgets.map(budget => {
        const spent = expenses[budget.category] || 0;
        
        return {
          category: budget.category,
          budgeted: budget.amount,
          spent: spent,
        };
      });
      
      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleBudgetAdded = () => {
    fetchData();
  };

  const handleBudgetDeleted = () => {
    fetchData();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Budget Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <>
              <Skeleton className="w-full h-64" />
              <Skeleton className="w-full h-96" />
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h2 className="text-xl font-semibold mb-4">Budget vs. Spending</h2>
                {chartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      budgeted: { 
                        color: '#3B82F6' 
                      },
                      spent: { 
                        color: '#EF4444' 
                      },
                    }}
                    className="h-64"
                  >
                    <BarChart data={chartData}>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="budgeted" name="Budget" fill="var(--color-budgeted)" />
                      <Bar dataKey="spent" name="Spent" fill="var(--color-spent)" />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No budget data available
                  </div>
                )}
              </div>
              
              <BudgetList 
                budgets={budgets} 
                expenses={expensesByCategory} 
                onBudgetDeleted={handleBudgetDeleted}
              />
            </>
          )}
        </div>
        
        <div>
          <BudgetForm onBudgetAdded={handleBudgetAdded} />
        </div>
      </div>
    </div>
  );
};

export default Budgets;
