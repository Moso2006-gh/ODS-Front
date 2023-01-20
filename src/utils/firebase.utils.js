import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import {generateUuid as generateID, createFinishedCometa} from './general.utils'

const firebaseConfig = {
  apiKey: "AIzaSyAzkDpWJFGevfrFsJMexQBCNsSgJG0SzPs",
  authDomain: "ods-proyect.firebaseapp.com",
  projectId: "ods-proyect",
  storageBucket: "ods-proyect.appspot.com",
  messagingSenderId: "546746566963",
  appId: "1:546746566963:web:451e20ae62ea175c1c1646",
  measurementId: "G-G41H1YPDV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();

export const db = getFirestore();
export const createCometaDoc = async () => {
  const cometaDoc = await addDoc(collection(db, 'Co-Metas'), {
    totalImages: 0,
    grid: {
      Rows1: ['', '', '', ''],
      Rows2: ['', '', '', ''],
      Rows3: ['', '', '', ''],
      Rows4: ['', '', '', ''],
    }
  });
  return cometaDoc.id;
}

export const getCometaDoc = async (ID) => {
  try {
    const docRef = doc(db, 'Co-Metas', ID);
    const docSnap = await getDoc(docRef);
    return docSnap;
  }
  catch(err) {
    return null;
  }
}

export const getImageFromID = async (ID) => {
  try {
    const url = await getDownloadURL(ref(storage, 'imagenes/' + ID));
    return url
  }
  catch (err) {
    return null;
  }
}

export const uploadImage = async (file) => {
  let ID = generateID();
  const reference = ref(storage, 'imagenes/' + ID);
  await uploadBytes(reference, file);
  
  return ID;
}

export const updateCometa = async(ID, newObject, currentImages) => {
  if(currentImages === 16) {
    createFinishedCometa(ID, newObject)
  }
  await setDoc(doc(db, 'Co-Metas', ID), {
    totalImages: currentImages,
    grid: {
      Rows1: newObject[0],
      Rows2: newObject[1],
      Rows3: newObject[2],
      Rows4: newObject[3],
    }
  });
}