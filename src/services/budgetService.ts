
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Budget } from "@/types";

export const budgetCollection = "budgets";

export const addBudget = async (budget: Omit<Budget, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, budgetCollection), {
      ...budget,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...budget };
  } catch (error) {
    console.error("Error adding budget: ", error);
    throw error;
  }
};

export const getBudgets = async (userId: string) => {
  try {
    const q = query(
      collection(db, budgetCollection),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const budgets: Budget[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      budgets.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
      } as Budget);
    });
    
    return budgets;
  } catch (error) {
    console.error("Error getting budgets: ", error);
    throw error;
  }
};

export const updateBudget = async (id: string, budget: Partial<Omit<Budget, 'id' | 'createdAt'>>) => {
  try {
    const budgetRef = doc(db, budgetCollection, id);
    await updateDoc(budgetRef, budget);
    return { id, ...budget };
  } catch (error) {
    console.error("Error updating budget: ", error);
    throw error;
  }
};

export const deleteBudget = async (id: string) => {
  try {
    const budgetRef = doc(db, budgetCollection, id);
    await deleteDoc(budgetRef);
    return true;
  } catch (error) {
    console.error("Error deleting budget: ", error);
    throw error;
  }
};

export const getBudgetByCategory = async (userId: string, category: string) => {
  try {
    const q = query(
      collection(db, budgetCollection),
      where("userId", "==", userId),
      where("category", "==", category)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
    } as Budget;
  } catch (error) {
    console.error("Error getting budget by category: ", error);
    throw error;
  }
};
