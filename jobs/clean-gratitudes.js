const { getAuth } = require("firebase/auth");
const firebaseConfig = require("../src/FirebaseConfig.js");
const { initializeApp } = require("firebase/app");
const {getFirestore} = require('firebase/firestore')
const {getStorage} = require('firebase/storage')
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

let email = process.argv[2];
let password = process.argv[3];

signInWithEmailAndPassword(auth, email, password).then(userinfo =>
    {
        console.log("UserInfo", userinfo);
    })

