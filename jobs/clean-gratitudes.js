const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const firebaseConfig = require("../src/FirebaseConfig.js");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  query,
  collection,
  getDocs,
  doc,
  deleteDoc,
} = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);

let email = process.argv[2];
let password = process.argv[3];

signInWithEmailAndPassword(auth, email, password).then((userinfo) => {
  console.log("UserInfo", userinfo);
  const userQuery = query(collection(db, "users"));
  const gratitudeQuery = query(collection(db, "gratitudes"));
  const users = [];
  getDocs(userQuery)
  .then((snapshot) => {
    snapshot.forEach((user) => {
      users.push(user.id);
    });
    console.log(users);
    return getDocs(gratitudeQuery)
  })
  .then((snapshot) => {
    snapshot.forEach((gratitude) => {
      if (!users.find((u) => u === gratitude.data().userId)) {
        console.log("Delete", gratitude.id);
        let gratitudeRef = doc(db, "gratitudes", gratitude.id);
        deleteDoc(gratitudeRef).then((_) => {
          console.log('deleted')
          process.exit();
        });
      }
    });
  });;
});
