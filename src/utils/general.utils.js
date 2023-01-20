import {createCanvas, loadImage} from 'canvas';
import { getImageFromID } from './firebase.utils';

export function generateUuid () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;

        return value.toString(16);
    });
};

export async function createFinishedCometa (ID, finishedCometa) {
    const canvas = createCanvas(2048, 2048);
    const ctx = canvas.getContext('2d');

    for (let r = 0; r < finishedCometa.length; r++) {
        const row = finishedCometa[r];
        for (let el = 0; el < row.length; el++) {
            const element = row[el];

            const url = await getImageFromID(element);
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.src = url;
            console.log(image);
            ctx.drawImage(image, 512, 512);
        }
        
    }

    document.getElementById('prueba').src = canvas.toDataURL();
    console.log('a');
    
    console.log(finishedCometa);
    
}