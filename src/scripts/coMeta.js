import $ from "jquery";
import { getCometaDoc, getImageFromID, updateCometa, uploadImage } from "../utils/firebase.utils";
import upload from "../img/cloudIcon.png"
import { createFinishedCometa } from "../utils/general.utils";

export default async function coMetaScript () {
    const cometaID = new URLSearchParams(window.location.search).get('co-meta');

    const cometaDoc = await getCometaDoc(cometaID)
    const cometaObj = cometaDoc._document.data.value.mapValue.fields;
    
    const nImages = parseInt(cometaObj.totalImages.integerValue);
    const grid = cometaObj.grid.mapValue.fields;

    let cometaImages = [
        [],
        [],
        [],
        [],
    ]
    let lastTouched = [];
    
    Object.keys(grid).forEach(async (row) => {
        const r = row.split('Rows')[1] - 1;
        
        await grid[row].arrayValue.values.forEach( async (el, e) => {
            cometaImages[r].push(el.stringValue);

            const div = $('.cometaRow')[r].children[e];
            if(el.stringValue === '') {
                div.children[0].src = upload;

                div.addEventListener('click', (event) => {
                    $('#uploadB').trigger('click');
                    const obj = event.target.nodeName === 'IMG' ? event.target.parentElement : event.target;
                    console.log(event.target.nodeName);

                    console.log(obj);
                    const cords = [
                        parseInt(obj.parentElement.id.split("Row")[1]) - 1,
                        parseInt(obj.classList[1].split('Element')[1]) - 1
                    ]

                    console.log('new Cords: ', cords);
                    lastTouched = cords;
                })
            }
            else {
                const newSrc = await getImageFromID(el.stringValue);
                div.children[0].src = newSrc;
            }
        })
    })

    if(nImages === 16) createFinishedCometa(cometaID, cometaImages)

    async function uploadCometaTrigger() {
        console.log('starting upload Commeta');
        const uploadedImage = $(this)[0].files[0];
        const path = await uploadImage(uploadedImage);
        console.log('image uploading');

        const newCometaObj = cometaImages;
        newCometaObj[lastTouched[0]][lastTouched[1]] = path;
        await updateCometa(cometaID, newCometaObj, nImages + 1);
        console.log('commeta updated');
        console.log('reloading');
        
        window.location.reload();
    }
    $('#uploadB').change(uploadCometaTrigger);
}