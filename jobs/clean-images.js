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
const {
  ref,
  getStorage,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} = require("firebase/storage");

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const storage = getStorage(app);
const db = getFirestore(app);

let email = process.argv[2];
let password = process.argv[3];

let work = async () => {
  let userinfo = await signInWithEmailAndPassword(auth, email, password);

  //   console.log("UserInfo", userinfo);

  const gratitudeQuery = query(collection(db, "gratitudes"));
  const gratitudes = [];
  let snapshot = await getDocs(gratitudeQuery);

  snapshot.forEach((gratitude) => {
    gratitudes.push({
      id: gratitude.id,
      userId: gratitude.data().userId,
      imagesrc: gratitude.data().imagesrc,
    });
  });

  // console.log("Available gratitudes\n", gratitudes);

  let requests = [];

  let gratitudeImageRef = ref(storage, 'gratitudeImages')

  let storageStuff = await listAll(gratitudeImageRef);


  // storageStuff.items.forEach(async item => {
  for(let item of storageStuff.items){
    console.log(item)
    let p = getDownloadURL(item)
    requests.push(p)
    let downloadUrl = await p;
    console.log(downloadUrl)
    if(!gratitudes.find(g => g.imagesrc === downloadUrl)){
      console.log("Deleting: ", downloadUrl)
      let pp = deleteObject(item)
      requests.push(pp)
      await pp;
    }
    else{
      console.log("File:", downloadUrl, "present in gratitudes.")
    }
  }
  // );
  await Promise.all(requests);
  process.exit();
  return;
};

work();
