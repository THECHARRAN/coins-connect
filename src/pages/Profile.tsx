
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
import { CreditCard, PiggyBank, LineChart, Award, ArrowRight, BarChart3 } from 'lucide-react';

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Lead Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    description: "Full-stack developer with a focus on React and Firebase integration."
  },
  {
    name: "Sam Garcia",
    role: "UI/UX Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    description: "Creates intuitive user interfaces and responsive designs for financial applications."
  },
  {
    name: "Taylor Wilson",
    role: "Financial Analyst",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    description: "Ensures that our app follows sound financial principles and best practices."
  }
];

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

const achievementsList = [
  "Helped users save over $2 million collectively",
  "Assisted in reducing discretionary spending by 15% on average",
  "Ranked in top finance apps for user satisfaction",
  "Simplified budget tracking for over 10,000 users"
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
        
        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle>Meet Our Team</CardTitle>
            <CardDescription>
              The people behind MindYourMoney
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-finance-primary/20">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-finance-primary font-medium">{member.role}</p>
                  <p className="text-muted-foreground text-sm mt-2">{member.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-6 w-6 text-finance-warning" />
              Our Achievements
            </CardTitle>
            <CardDescription>
              What we've accomplished so far
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {achievementsList.map((achievement, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-finance-success/20 text-finance-success flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 flex justify-between">
            <span className="text-sm text-muted-foreground">Join us on our journey</span>
            <Button variant="outline" asChild>
              <a href="/signup">Get Started</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
