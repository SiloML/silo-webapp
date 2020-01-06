import * as firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyBQpRsuFtYzxo3T304nnxtOWkJirZ6NsH0",
    authDomain: "our-fl-platform.firebaseapp.com",
    databaseURL: "https://our-fl-platform.firebaseio.com",
    projectId: "our-fl-platform",
    storageBucket: "our-fl-platform.appspot.com",
    messagingSenderId: "698414177342",
    appId: "1:698414177342:web:4c61f1ec632d01ea06456f",
    measurementId: "G-9YSMQ9E0KZ"
  };
firebase.initializeApp(firebaseConfig);
const databaseRef = firebase.database().ref();
export const permissionsRef = databaseRef.child("permissions")