// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "../FirebaseConfig";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export async function getUserGratitude(userid) {
  let docref = doc(db, "gratitudes", userid);
  let userGratitudeRef = await getDoc(docref);
  return userGratitudeRef.data();
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

export async function uploadUserDetails(userid, userData){
  let docref = doc(db, 'users', userid );
  await setDoc(docref, userData, {merge: true})
}

export async function registerToApp(email, password) {
  try {
    let userinfo = await createUserWithEmailAndPassword(auth, email, password);
    let userData = {
      userName: '',
      description: '',
      profileImageUrl: ''
    }
    let userRef = doc(db, 'users', userinfo.user.uid);
    let gratitudeRef = doc(db, 'gratitudes', userinfo.user.uid)
    await setDoc(userRef, userData, {merge: true});
    await setDoc(gratitudeRef,{ gratitudes: [{id: Date.now(), name: "my gratitudes", description: "helped me a lot", imagesrc: null}]});
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
