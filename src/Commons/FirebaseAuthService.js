// Import the functions you need from the SDKs you need
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import app from './FirebaseBase'
// Initialize Firebase
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export function setAuthStateChanged(authStateChangeHandler){
  onAuthStateChanged(auth, authStateChangeHandler);
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
    await setPersistence(auth, browserLocalPersistence);
    let userinfo = await signInWithEmailAndPassword(auth, email, password);
    return userinfo;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function signOutFromApp() {
  await signOut(auth);
}
