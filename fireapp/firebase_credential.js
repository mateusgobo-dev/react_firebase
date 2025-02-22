// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyADd0REnvNXGDWTbR6sIcyoVXH5fhYFaV8",
    authDomain: "curso-react-cba6e.firebaseapp.com",
    projectId: "curso-react-cba6e",
    storageBucket: "curso-react-cba6e.firebasestorage.app",
    messagingSenderId: "172147140008",
    appId: "1:172147140008:web:511d435b50d3f9bb18299d",
    measurementId: "G-EJCJKHKVD4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);