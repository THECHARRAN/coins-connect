
import React from 'react';
import { SavingsGoal } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { deleteSavingsGoal, updateSavingsGoal } from '@/services/savingsGoalService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface GoalListProps {
  goals: SavingsGoal[];
  onGoalUpdated: () => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, onGoalUpdated }) => {
  const [selectedGoal, setSelectedGoal] = React.useState<SavingsGoal | null>(null);
  const [newAmount, setNewAmount] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>You haven't created any savings goals yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          Create a savings goal to track your progress
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteSavingsGoal(id);
      toast.success("Goal deleted successfully");
      onGoalUpdated();
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const handleUpdateAmount = async () => {
    if (!selectedGoal) return;
    
    try {
      const amount = parseFloat(newAmount);
      if (isNaN(amount) || amount < 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      
      await updateSavingsGoal(selectedGoal.id, { currentAmount: amount });
      toast.success("Goal progress updated successfully");
      onGoalUpdated();
      setOpen(false);
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
    }
  };

  const openUpdateDialog = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setNewAmount(goal.currentAmount.toString());
    setOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Savings Goals</CardTitle>
          <CardDescription>Track your progress towards financial goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {goals.map((goal) => {
            const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
            const daysRemaining = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openUpdateDialog(goal)}
                    >
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                
                <Progress 
                  value={percentage} 
                  className="bg-blue-200" 
                />
                
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">${goal.currentAmount.toFixed(2)}</span>
                    <span className="text-muted-foreground"> saved</span>
                  </div>
                  <div>
                    <span className="font-medium">${goal.targetAmount.toFixed(2)}</span>
                    <span className="text-muted-foreground"> target</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{percentage}%</span>
                    <span className="text-muted-foreground"> complete</span>
                  </div>
                  <div>
                    <span className={`font-medium ${daysRemaining < 30 ? 'text-amber-500' : ''}`}>
                      {daysRemaining} days
                    </span>
                    <span className="text-muted-foreground"> remaining</span>
                  </div>
                </div>
                
                <div className="text-right text-xs text-muted-foreground">
                  Deadline: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Goal Progress</DialogTitle>
            <DialogDescription>
              Update your current savings amount for {selectedGoal?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="current-amount">Current Amount</Label>
            <Input
              id="current-amount"
              type="number"
              step="0.01"
              min="0"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAmount}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalList;
