import * as firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyAW6DQg8aOVNjtqkoW1Z2btWf7nRppncxs",
    authDomain: "silo-ml.firebaseapp.com",
    databaseURL: "https://silo-ml.firebaseio.com",
    projectId: "silo-ml",
    storageBucket: "silo-ml.appspot.com",
    messagingSenderId: "64634408148",
    appId: "1:64634408148:web:31dcd430ca169fcbbd3f41",
    measurementId: "G-20Z0QKWCTP"
  };
firebase.initializeApp(firebaseConfig);
const databaseRef = firebase.database().ref();
export const permissionsRef = databaseRef.child("permissions")