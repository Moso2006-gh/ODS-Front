import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore'
import { getStorage, getDownloadURL, ref, uploadBytes, listAll } from 'firebase/storage'
import {generateUuid as generateID } from './general.utils'

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
      Rows1: ['', '' ],
      Rows2: ['', '' ],
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

export const getImageFromID = async (ID, cometa) => {
  try {
    console.log(!cometa ? 'imagenes/' : 'cometas/');
    const url = await getDownloadURL(ref(storage, (!cometa ? 'imagenes/' : 'cometas/') + ID));
    console.log(url);
    return url
  }
  catch (err) {
    return null;
  }
}

export const uploadImage = async (file) => {
  let ID = generateID();
  const reference = ref(storage, 'imagenes/' + ID);
  console.log(file);
  await uploadBytes(reference, file);
  
  return ID;
}

export const updateCometa = async(ID, newObject, currentImages) => {
  await setDoc(doc(db, 'Co-Metas', ID), {
    totalImages: currentImages,
    grid: {
      Rows1: newObject[0],
      Rows2: newObject[1],
    }
  });
  console.log('updated: ', currentImages);
}

export const uploadFinishedCometa = async (ID, finishedCometa) => {
  try {
    const reference = ref(storage, 'cometas/' + ID);
    
    await uploadBytes(reference, finishedCometa)
    await setDoc(doc(db, 'Co-Metas', ID), {
      finished: true
    });

    return;
  } catch (err) {console.log('couldn\'t upload cometa:', err);}
}

export const getRandomCometa = async () => {
  const reference = ref(storage, 'cometas/');
  const list = await listAll(reference);
  const items = list.items;

  if(items.length !== 0) {
    const index = Math.floor(Math.random() * items.length);
    const url = await getDownloadURL(items[index]);
    
    return url;;
  }
  else return null;
  
}