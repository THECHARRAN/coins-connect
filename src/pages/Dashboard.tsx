
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, CATEGORIES, Budget } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    if (!currentUser) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch recent transactions
        const transactionsQuery = query(
          collection(db, "transactions"),
          where("userId", "==", currentUser.uid),
          orderBy("date", "desc"),
          limit(10)
        );
        
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData: Transaction[] = [];
        
        transactionsSnapshot.forEach((doc) => {
          const data = doc.data();
          transactionsData.push({
            id: doc.id,
            ...data,
            date: data.date.toDate(),
            createdAt: data.createdAt.toDate(),
          } as Transaction);
        });
        
        setTransactions(transactionsData);
        
        // Fetch budgets
        const budgetsQuery = query(
          collection(db, "budgets"),
          where("userId", "==", currentUser.uid)
        );
        
        const budgetsSnapshot = await getDocs(budgetsQuery);
        const budgetsData: Budget[] = [];
        
        budgetsSnapshot.forEach((doc) => {
          const data = doc.data();
          budgetsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
          } as Budget);
        });
        
        setBudgets(budgetsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Prepare data for charts
  const categoryData = CATEGORIES.map((category) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category === category.value && t.type === 'expense'
    );
    const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      name: category.label,
      value: totalAmount,
      icon: category.icon,
    };
  }).filter((item) => item.value > 0);

  // Sample monthly data (in a real app, you'd calculate this from actual transactions)
  const monthlyData = [
    { name: 'Jan', expenses: 1200, income: 2500 },
    { name: 'Feb', expenses: 1800, income: 2500 },
    { name: 'Mar', expenses: 1400, income: 2800 },
    { name: 'Apr', expenses: 1300, income: 2600 },
    { name: 'May', expenses: 1900, income: 3000 },
    { name: 'Jun', expenses: 1700, income: 3100 },
  ];

  // Calculate total income and expenses
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-finance-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Financial Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className={balance >= 0 ? "text-finance-success text-2xl" : "text-finance-danger text-2xl"}>
              ${balance.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-finance-success text-2xl">${totalIncome.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-finance-danger text-2xl">${totalExpenses.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Expense by Category */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value}`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Income vs Expenses */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => {
                    const category = CATEGORIES.find(c => c.value === transaction.category);
                    return (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {transaction.date instanceof Date
                            ? transaction.date.toLocaleDateString()
                            : new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{transaction.description}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center">
                            <span className="mr-2">{category?.icon}</span>
                            {category?.label}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right ${transaction.type === 'income' ? 'text-finance-success' : 'text-finance-danger'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No transactions found. Add your first transaction!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
