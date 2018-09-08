import Firebase from 'firebase';

let config = {
    apiKey: "AIzaSyA_ljlUDYVJJ5uHKbhNmWK8O6Rs5bS_-5I",
    authDomain: "alpharides-b2c35.firebaseapp.com",
    databaseURL: "https://alpharides-b2c35.firebaseio.com/",
    projectId: "alpharides-b2c35",
    storageBucket: "alpharides-b2c35.appspot.com",
    messagingSenderId: "654672384859"
};


export const db = Firebase.initializeApp(config);