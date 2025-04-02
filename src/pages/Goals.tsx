
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSavingsGoals } from "@/services/savingsGoalService";
import GoalForm from "@/components/goals/GoalForm";
import GoalList from "@/components/goals/GoalList";
import { SavingsGoal } from "@/types";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon } from "lucide-react";

const Goals: React.FC = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EF4444'];

  const fetchData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const fetchedGoals = await getSavingsGoals(currentUser.uid);
      setGoals(fetchedGoals);
      
      // Prepare chart data for goal progress
      const data = fetchedGoals.map(goal => {
        const remaining = goal.targetAmount - goal.currentAmount;
        return {
          name: goal.name,
          currentAmount: goal.currentAmount,
          remaining: remaining > 0 ? remaining : 0,
        };
      });
      
      setChartData(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const handleGoalAdded = () => {
    fetchData();
  };

  const handleGoalUpdated = () => {
    fetchData();
  };

  const calculateTotalSaved = () => {
    return goals.reduce((total, goal) => total + goal.currentAmount, 0);
  };

  const calculateTotalTarget = () => {
    return goals.reduce((total, goal) => total + goal.targetAmount, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Savings Goals</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <>
              <Skeleton className="w-full h-64" />
              <Skeleton className="w-full h-96" />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Total Saved</h3>
                  <p className="text-3xl font-bold text-finance-primary">${calculateTotalSaved().toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Total Goals</h3>
                  <p className="text-3xl font-bold text-finance-dark">${calculateTotalTarget().toFixed(2)}</p>
                </div>
              </div>
            
              <div className="bg-white rounded-lg shadow-sm p-6 border">
                <h2 className="text-xl font-semibold mb-4">Goals Progress</h2>
                {chartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      completed: { 
                        color: '#3B82F6' 
                      },
                      remaining: { 
                        color: '#E5E7EB' 
                      },
                    }}
                    className="h-64"
                  >
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="currentAmount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#3B82F6"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="flex items-center">
                      <InfoIcon className="mr-2 h-5 w-5" />
                      <span>Add savings goals to see progress charts</span>
                    </div>
                  </div>
                )}
              </div>
              
              <GoalList goals={goals} onGoalUpdated={handleGoalUpdated} />
            </>
          )}
        </div>
        
        <div>
          <GoalForm onGoalAdded={handleGoalAdded} />
        </div>
      </div>
    </div>
  );
};

export default Goals;
