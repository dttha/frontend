import firebase from 'firebase/app';
import 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyAR-kGJv7exBT0skSlHcAlSGu4j_Kz0_Lc",
    authDomain: "e-ecommerce-95c2e.firebaseapp.com",
    projectId: "e-ecommerce-95c2e",
    storageBucket: "e-ecommerce-95c2e.appspot.com",
    messagingSenderId: "502050636012",
    appId: "1:502050636012:web:5cabc74ed35f6392a5a5c9",
    measurementId: "G-D1TF0TVGBN"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export default firebase;

export { storage };