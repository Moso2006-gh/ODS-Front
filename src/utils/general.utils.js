import $ from "jquery";
import { uploadFinishedCometa } from "./firebase.utils";

export function generateUuid () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;

        return value.toString(16);
    });
};

export async function createFinishedCometa (ID) {
    const canvas = document.getElementById('FinalCanvas'); 
    canvas.width = 1024; canvas.height  = 1024; 
    const ctx = canvas.getContext("2d");

    for (let r = 0; r < 2; r++) { //Cambio
        for (let el = 0; el < 2; el++) {
            
            const url = $('.cometaRow')[r].children[el].children[0].getAttribute('src')
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.setAttribute('crossorigin', 'anonymous');
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            })
            
            await ctx.drawImage(image, el*512, r*512, 512, 512);
            console.log('d');
        }
        
    }

    await new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
            let file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
            await uploadFinishedCometa(ID, file)
            resolve();
        }, 'image/jpeg');    
    })

    return;
}