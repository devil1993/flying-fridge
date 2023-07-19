// Import the functions you need from the SDKs you need
import {
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import app from './FirebaseBase'
// Initialize Firebase
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export async function getPublishedGratitudes(userId) {
  const q = query(
    collection(db, "gratitudes"),
    where("userId", "==", userId),
    where("isEnabled", "==", true)
  );
  const querySnapshot = await getDocs(q);
  const gratitudes = [];
  querySnapshot.forEach((doc) => {
    gratitudes.push({ ...doc.data(), id: doc.id });
  });
  console.log(gratitudes);
  return { gratitudes: gratitudes };
}

export async function deleteUserGratitude(gratitudeItem) {
  let gratitudeRef = doc(db, "gratitudes", gratitudeItem.id);
  deleteGratitudeImage(gratitudeItem.id)
  await deleteDoc(gratitudeRef);
}

export async function saveUserGratitude(gratitudeItem) {
  gratitudeItem.userId = auth.currentUser.uid;
  console.log(gratitudeItem);
  let gratitudeRef = doc(db, "gratitudes", gratitudeItem.id);
  await setDoc(gratitudeRef, gratitudeItem, { merge: true });
}

export async function getUserGratitude(userid) {
  const q = query(collection(db, "gratitudes"), where("userId", "==", userid));
  const querySnapshot = await getDocs(q);
  const gratitudes = [];
  querySnapshot.forEach((doc) => {
    gratitudes.push({ ...doc.data(), id: doc.id });
  });
  console.log(gratitudes);
  return { gratitudes: gratitudes };
}

export async function setUserGratitude(userid, usergGratitudes) {
  let docref = doc(db, "gratitudes", userid);
  return setDoc(docref, usergGratitudes, { merge: true });
}

export async function uploadGratitudeImage(gratitudeId, fileinfo) {
  const imageRef = ref(storage, `gratitudeImages/${gratitudeId}`);
  await uploadBytes(imageRef, fileinfo);
  const url = await getDownloadURL(imageRef);
  return url;
}

export async function deleteGratitudeImage(gratitudeId){
  try{
    const imageRef = ref(storage, `gratitudeImages/${gratitudeId}`);
    await deleteObject(imageRef);
  }
  catch(e){
    console.log(e);
  }
}
