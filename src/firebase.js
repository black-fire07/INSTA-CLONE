import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBhMh7SqCrOBcbfQlezjgnhVRjna4bmP1g",
    authDomain: "clone-2d845.firebaseapp.com",
    databaseURL: "https://clone-2d845.firebaseio.com",
    projectId: "clone-2d845",
    storageBucket: "clone-2d845.appspot.com",
    messagingSenderId: "504762213291",
    appId: "1:504762213291:web:a5a7878ceaedafe303a8ee",
    measurementId: "G-VW41P8D5DV"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };