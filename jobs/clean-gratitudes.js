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

let work = async () => {
  let userinfo = await signInWithEmailAndPassword(auth, email, password);

//   console.log("UserInfo", userinfo);

  const userQuery = query(collection(db, "users"));
  const gratitudeQuery = query(collection(db, "gratitudes"));
  const users = [];
  let snapshot = await getDocs(userQuery);

  snapshot.forEach((user) => {
    users.push(user.id);
  });

  console.log("Available users\n", users);

  snapshot = await getDocs(gratitudeQuery);

  let requests = [];
  snapshot.forEach((gratitude) =>
    // for(let gratitude of snapshot)
    {
      if (!users.find((u) => u === gratitude.data().userId)) {
        console.log("Deleting", gratitude.id);
        let gratitudeRef = doc(db, "gratitudes", gratitude.id);
        let p = deleteDoc(gratitudeRef);
        requests.push(p);
      }
    }
  );
  await Promise.all(requests);
  process.exit();
  return;
};

work();
