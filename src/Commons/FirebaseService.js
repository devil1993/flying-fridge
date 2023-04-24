// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3zcVKb6WbJsugOoMJYBE2GeTS6DHU3nU",
  authDomain: "flying-fridge.firebaseapp.com",
  projectId: "flying-fridge",
  storageBucket: "flying-fridge.appspot.com",
  messagingSenderId: "709977221159",
  appId: "1:709977221159:web:ed256516db1d14493a8602"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export async function registerToApp(email, password){
  try{
    let userinfo = await createUserWithEmailAndPassword(auth, email, password);
    return [true, userinfo];
  }
  catch(e){
    return [false, e];
  }
}

function signInToApp(){

}

function signOutFromApp(){

}


