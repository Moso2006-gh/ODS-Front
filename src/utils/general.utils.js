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
    console.log('building Finished');
    const canvas = document.getElementById('FinalCanvas'); 
    canvas.width = 2048; canvas.height  = 2048; 
    const ctx = canvas.getContext("2d");

    for (let r = 0; r < 4; r++) {
        for (let el = 0; el < 4; el++) {
            
            const url = $('.cometaRow')[r].children[el].children[0].getAttribute('src')
            console.log($('.cometaRow')[r].children[el].children[0], url);
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.setAttribute('crossorigin', 'anonymous');
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            })
            
            console.log(image);
            ctx.drawImage(image, el*512, r*512, 512, 512);
        }
        
    }

    await canvas.toBlob(async (blob) => {
        let file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
        console.log(file);
        await uploadFinishedCometa(ID, file)
    }, 'image/jpeg');    
}