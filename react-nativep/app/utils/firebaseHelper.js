// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = ()=>{
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBF-pqWgJlkQmxDoPRCJjXLEHlWfsiZ8WI",
  authDomain: "chat-15a8c.firebaseapp.com",
  databaseURL: "https://chat-15a8c-default-rtdb.firebaseio.com",
  projectId: "chat-15a8c",
  storageBucket: "chat-15a8c.appspot.com",
  messagingSenderId: "281701771231",
  appId: "1:281701771231:web:ae7e644e8b5e31235b466a"
};

// Initialize Firebase
return initializeApp(firebaseConfig);
}