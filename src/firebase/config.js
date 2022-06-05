import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9Zg70wEjWhxD7AL-4522TQmcxvasJAvU",
  authDomain: "project-mgmt-site.firebaseapp.com",
  projectId: "project-mgmt-site",
  storageBucket: "project-mgmt-site.appspot.com",
  messagingSenderId: "1099031671642",
  appId: "1:1099031671642:web:1e82a836d9894286d33963",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initilize Service
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp };
