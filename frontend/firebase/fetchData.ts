import { db } from './firebase';
import { getDocs, query, where, collection, onSnapshot } from "firebase/firestore";
import { IPsychiatrist } from '@/schema';

/**
 * Fetches professional data from the Firestore based on first and last name.
 * 
 * @param firstName - The first name of the professional.
 * @param lastName - The last name of the professional.
 * @returns The professional data, or null if not found.
 */
const fetchProfessionalData = async (firstName: string, lastName: string) => {
  try {
    const q = query(
      collection(db, "psychiatrists"),
      where("first_name", "==", firstName),
      where("last_name", "==", lastName)
    );

    const response = await getDocs(q);
    if (!response.empty) {
      const docData = response.docs[0].data();
      const psychiatrist = docData as IPsychiatrist;
      return psychiatrist;
    } else {
      throw new Error(`No psychiatrist found with the name: ${firstName} ${lastName}`);
    }
  } catch (error) {
    console.error("Error fetching professional data:", error);
    throw error;
  }
};

const fetchAllProfessionals = async () => {
  try {
    const psychRef = collection(db, 'psychiatrists');
    const snapshot = await getDocs(psychRef);
    const fetchedPsychiatrists: IPsychiatrist[] = snapshot.docs.map((doc) => doc.data() as IPsychiatrist);
    return fetchedPsychiatrists;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
}

function fetchUserChats(setMessages) {
  // const userId = auth.currentUser?.uid;
  const userId = "123"

  if (!userId) {
    console.error("No user is authenticated.");
    return () => { }; // Return an empty function for consistent return type
  }

  const conversationsRef = collection(db, "conversations");
  const q = query(conversationsRef, where("participants", "array-contains", userId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const userConversations = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setMessages(userConversations);
  });

  return unsubscribe;
}

const fetchDocumentId = async (type: string, uid: string)  => {
  try {
    const q = query(
      collection(db, type),
      where("uid", "==", uid)
    );
    const response = await getDocs(q);
    if (!response.empty) {
      const doc = response.docs[0];
      const docId = doc.id;
      return docId;
    }
  } catch (error: any) {
    console.error(error.message);
  }
}

export { fetchProfessionalData, fetchAllProfessionals, fetchUserChats, fetchDocumentId };

