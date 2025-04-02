
export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type Category = 
  | 'food'
  | 'transportation' 
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'healthcare'
  | 'education'
  | 'personal'
  | 'travel'
  | 'gifts'
  | 'income'
  | 'other';

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'food', label: 'Food & Dining', icon: '🍔' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'housing', label: 'Housing', icon: '🏠' },
  { value: 'utilities', label: 'Utilities', icon: '💡' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'gifts', label: 'Gifts & Donations', icon: '🎁' },
  { value: 'income', label: 'Income', icon: '💰' },
  { value: 'other', label: 'Other', icon: '📌' },
];

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: Date | string;
  category: Category;
  description: string;
  type: TransactionType;
  createdAt: Date | string;
}

export interface Budget {
  id: string;
  userId: string;
  category: Category;
  amount: number;
  period: 'monthly' | 'yearly';
  createdAt: Date | string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | string;
  createdAt: Date | string;
}
