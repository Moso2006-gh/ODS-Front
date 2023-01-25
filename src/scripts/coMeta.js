import '../pages/styles/CoMeta.scss'

import $ from "jquery";
import { getCometaDoc, getImageFromID, updateCometa, uploadImage } from "../utils/firebase.utils";
import upload from "../img/cloudIcon.png"
import { createFinishedCometa } from "../utils/general.utils";

let nImages, grid, cometaID, lastTouched;
let cometaImages = [
    [],
    [],
]

export default async function coMetaScript () {
    cometaID = new URLSearchParams(window.location.search).get('co-meta');
    
    const cometaDoc = await getCometaDoc(cometaID)
    const cometaObj = cometaDoc._document.data.value.mapValue.fields;
    
    try {
        nImages = parseInt(cometaObj.totalImages.integerValue);
        grid = cometaObj.grid.mapValue.fields;

        setUpCometa();
    }
    catch {
        displayFinishedCometa()
    }
}

async function displayFinishedCometa() {
    $('#cometaGrid').remove();
    const cometaImage = await getImageFromID(cometaID, true);
    $('#Finishedcometa')[0].src = cometaImage;
}

async function setUpCometa() {
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
                if(newSrc !== null) div.children[0].src = newSrc;
            }
        })
    })
}

async function uploadCometaTrigger() {
    const uploadedImage = $(this)[0].files[0];
    $('.cometaRow')[lastTouched[0]].children[lastTouched[1]].children[0].setAttribute('src', URL.createObjectURL(uploadedImage))

    const path = await uploadImage(uploadedImage);

    const newCometaObj = cometaImages;
    newCometaObj[lastTouched[0]][lastTouched[1]] = path;
    
    if(nImages + 1 === 4) await finishCometa();
    else await updateCometa(cometaID, newCometaObj, nImages + 1);
    nImages++;
}
$('#uploadB').change(uploadCometaTrigger);

async function finishCometa() {
    await createFinishedCometa(cometaID);

    displayFinishedCometa();
}