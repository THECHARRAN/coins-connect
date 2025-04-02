
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CreditCard, PiggyBank, LineChart, ArrowRight, BarChart3 } from 'lucide-react';

const appFeatures = [
  {
    title: "Transaction Tracking",
    description: "Easily record and categorize all your expenses and income in one place.",
    icon: <CreditCard className="h-8 w-8 text-finance-primary" />
  },
  {
    title: "Budget Management",
    description: "Set budgets for different categories and get alerts when you're close to limits.",
    icon: <BarChart3 className="h-8 w-8 text-finance-warning" />
  },
  {
    title: "Savings Goals",
    description: "Create and track progress towards your financial goals with visual indicators.",
    icon: <PiggyBank className="h-8 w-8 text-finance-success" />
  },
  {
    title: "Financial Insights",
    description: "View charts and reports to understand your spending habits and patterns.",
    icon: <LineChart className="h-8 w-8 text-finance-accent" />
  }
];

const Profile: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">About MindYourMoney</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* App Overview */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-finance-primary/10 to-finance-accent/10 border-b">
            <CardTitle className="text-2xl">Our Mission</CardTitle>
            <CardDescription className="text-base">
              Empowering you to take control of your financial future
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed mb-6">
              MindYourMoney was created with a simple goal: to make personal finance management accessible, intuitive, and even enjoyable for everyone. 
              We believe that financial literacy and good money habits should be available to all, regardless of background or expertise.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="mt-4" asChild>
              <a href="/dashboard">
                Start Managing Your Finances <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
