import * as firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyC6EDL8gMkZc3GGzGveMqWe5zvAr5DNiL4",
    authDomain: "blood-components.firebaseapp.com",
    databaseURL: "https://blood-components.firebaseio.com",
    projectId: "blood-components",
    storageBucket: "blood-components.appspot.com",
    messagingSenderId: "388223113819",
    appId: "1:388223113819:web:1273570a12add0fedafd7e",
    measurementId: "G-K6NM078FWD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();





export { db, auth,firebase , functions as default}


    




