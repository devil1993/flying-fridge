// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseConfig from "../FirebaseConfig";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export async function getPublishedGratitudes(userId){
  const q = query(collection(db, "gratitudes"), where("userId", "==", userId), where("isEnabled", "==", true));
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

export async function getUserDetails(userid) {
  let docref = doc(db, "users", userid);
  let userDataRef = await getDoc(docref);
  return userDataRef.data();
}

export async function uploadUserDetails(userid, userData) {
  let docref = doc(db, "users", userid);
  await setDoc(docref, userData, { merge: true });
}

export async function uploadProfileImage(userid, fileinfo) {
  const imageRef = ref(storage, `profileImages/${userid}`);
  await uploadBytes(imageRef, fileinfo);
  const url = await getDownloadURL(imageRef);
  return url;
}

export async function uploadGratitudeImage(gratitudeId, fileinfo) {
  const imageRef = ref(storage, `gratitudeImages/${gratitudeId}`);
  await uploadBytes(imageRef, fileinfo);
  const url = await getDownloadURL(imageRef);
  return url;
}

export async function registerToApp(email, password) {
  try {
    let userinfo = await createUserWithEmailAndPassword(auth, email, password);
    let userData = {
      userName: "",
      description: "",
      profileImageUrl: "",
    };
    let userRef = doc(db, "users", userinfo.user.uid);
    await setDoc(userRef, userData, { merge: true });
    return [true, userinfo];
  } catch (e) {
    return [false, e];
  }
}

export function checkUserLoggedIn() {
  return auth.currentUser;
}

export async function signInToApp(email, password) {
  try {
    let userinfo = await signInWithEmailAndPassword(auth, email, password);
    return userinfo;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function signOutFromApp() {
  await signOut(auth);
}
