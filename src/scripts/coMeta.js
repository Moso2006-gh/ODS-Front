import $ from "jquery";
import { getCometaDoc, getImageFromID, updateCometa, uploadImage } from "../utils/firebase.utils";
import upload from "../img/cloudIcon.png"

export default async function coMetaScript () {
    const cometaID = new URLSearchParams(window.location.search).get('co-meta');

    const cometaDoc = await getCometaDoc(cometaID)
    const cometaObj = cometaDoc._document.data.value.mapValue.fields
    let cometaImages = [
        [],
        [],
        [],
        [],
    ]
    let lastTouched = [];
    
    Object.keys(cometaObj).forEach(async (row) => {
        const r = row.split('Rows')[1] - 1;
        
        await cometaObj[row].arrayValue.values.forEach( async (el, e) => {
            cometaImages[r].push(el.stringValue);

            const div = $('.cometaRow')[r].children[e];
            if(el.stringValue === '') {
                div.children[0].src = upload;

                div.children[0].addEventListener('click', (event) => {
                    $('#uploadB').trigger('click');
                    console.log(event);
                    const cords = [
                        parseInt(event.path[2].id.split("Row")[1]) - 1,
                        parseInt(event.path[1].classList[1].split('Element')[1]) - 1
                    ]

                    lastTouched = cords;
                })
            }
            else {
                const newSrc = await getImageFromID(el.stringValue);
                div.children[0].src = newSrc;
            }
        })
    })

    async function uploadCometaTrigger() {
        const uploadedImage = $(this)[0].files[0];
        const path = await uploadImage(uploadedImage);
        
        const newCometaObj = cometaImages;
        newCometaObj[lastTouched[0]][lastTouched[1]] = path;
        await updateCometa(cometaID, newCometaObj);
        window.location.reload();
    }
    $('#uploadB').change(uploadCometaTrigger);
}