import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyADd0REnvNXGDWTbR6sIcyoVXH5fhYFaV8",
    authDomain: "curso-react-cba6e.firebaseapp.com",
    projectId: "curso-react-cba6e",
    storageBucket: "curso-react-cba6e.firebasestorage.app",
    messagingSenderId: "172147140008",
    appId: "1:172147140008:web:511d435b50d3f9bb18299d",
    measurementId: "G-EJCJKHKVD4"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
export {db, auth};