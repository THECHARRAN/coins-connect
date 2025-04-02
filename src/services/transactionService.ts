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
import { Transaction } from "@/types";

export const transactionCollection = "transactions";

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, transactionCollection), {
      ...transaction,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...transaction };
  } catch (error) {
    console.error("Error adding transaction: ", error);
    throw new Error("Failed to add transaction. Please check your Firestore rules and permissions.");
  }
};

export const getTransactions = async (userId: string) => {
  try {
    console.log("Fetching transactions for user:", userId);
    const q = query(
      collection(db, transactionCollection),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    console.log("Query snapshot size:", querySnapshot.size);
    const transactions: Transaction[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt?.toDate(),
      } as Transaction);
    });
    
    return transactions;
  } catch (error) {
    console.error("Error getting transactions: ", error);
    throw new Error("Failed to retrieve transactions. Please check your Firestore rules and permissions.");
  }
};

export const updateTransaction = async (id: string, transaction: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
  try {
    const transactionRef = doc(db, transactionCollection, id);
    await updateDoc(transactionRef, transaction);
    return { id, ...transaction };
  } catch (error) {
    console.error("Error updating transaction: ", error);
    throw error;
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const transactionRef = doc(db, transactionCollection, id);
    await deleteDoc(transactionRef);
    return true;
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    throw error;
  }
};

export const getTransactionsByCategory = async (userId: string, category: string) => {
  try {
    const q = query(
      collection(db, transactionCollection),
      where("userId", "==", userId),
      where("category", "==", category),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt?.toDate(),
      } as Transaction);
    });
    
    return transactions;
  } catch (error) {
    console.error("Error getting transactions by category: ", error);
    throw error;
  }
};
