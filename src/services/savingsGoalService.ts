
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
import { SavingsGoal } from "@/types";

export const savingsGoalCollection = "savings_goals";

export const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, savingsGoalCollection), {
      ...goal,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...goal };
  } catch (error) {
    console.error("Error adding savings goal: ", error);
    throw error;
  }
};

export const getSavingsGoals = async (userId: string) => {
  try {
    const q = query(
      collection(db, savingsGoalCollection),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const goals: SavingsGoal[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      goals.push({
        id: doc.id,
        ...data,
        deadline: data.deadline?.toDate(),
        createdAt: data.createdAt?.toDate(),
      } as SavingsGoal);
    });
    
    return goals;
  } catch (error) {
    console.error("Error getting savings goals: ", error);
    throw error;
  }
};

export const updateSavingsGoal = async (id: string, goal: Partial<Omit<SavingsGoal, 'id' | 'createdAt'>>) => {
  try {
    const goalRef = doc(db, savingsGoalCollection, id);
    await updateDoc(goalRef, goal);
    return { id, ...goal };
  } catch (error) {
    console.error("Error updating savings goal: ", error);
    throw error;
  }
};

export const deleteSavingsGoal = async (id: string) => {
  try {
    const goalRef = doc(db, savingsGoalCollection, id);
    await deleteDoc(goalRef);
    return true;
  } catch (error) {
    console.error("Error deleting savings goal: ", error);
    throw error;
  }
};
