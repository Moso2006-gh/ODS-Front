import '../pages/styles/CoMeta.scss'

import $ from "jquery";
import { getCometaDoc, getImageFromID, updateCometa, uploadImage } from "../utils/firebase.utils";
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
    nImages = parseInt(cometaObj.totalImages.integerValue);
    
    try {
        grid = cometaObj.grid.mapValue.fields;
        setUpCometa();
    }
    catch {
        displayFinishedCometa()
    }

    if(nImages > 0) $('#compartir').prop("disabled", false);
    $('#compartir').on('click', compartir)
    $('#galeriaB').on('click', () => window.location.href = window.location.href.split('/')[0] + '/home.html')
}

function compartir() {
    if(navigator.share) {
        navigator.share({ title: "CoMeta", text:" ¡¡contribuye a mi cometa con tu arte!!", url: window.location.href })
    }
    else {
        navigator.clipboard.writeText(window.location.href);
    }
} 

async function displayFinishedCometa() {
    $('#cometaText').text("¡Felicidades, habeís lanzado vuestra cometa!")
    $('#cometaText').css('color', "#040327")    
    $('#background').addClass('Finished')

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
                div.addEventListener('click', clickOnUploadImg)
            }
            else {
                const newSrc = await getImageFromID(el.stringValue);
                if(newSrc !== null) div.children[0].src = newSrc;
                div.children[0].removeAttribute('id')
            }
        })
    })
}

async function finishCometa() {
    await createFinishedCometa(cometaID);

    displayFinishedCometa();
}


function clickOnUploadImg(event) {
    $('#uploadB').trigger('click');
    const obj = event.target.nodeName === 'IMG' ? event.target.parentElement : event.target;
    const cords = [
        parseInt(obj.parentElement.id.split("Row")[1]) - 1,
        parseInt(obj.classList[1].split('Element')[1]) - 1
    ]
    lastTouched = cords;
}

async function uploadButtonTrigger() {
    if(nImages === 0) $('#compartir').prop("disabled", false);

    const uploadedImage = $(this)[0].files[0];
    const imageObj = $('.cometaRow')[lastTouched[0]].children[lastTouched[1]].children[0]
    imageObj.setAttribute('src', URL.createObjectURL(uploadedImage))
    imageObj.removeAttribute('id');

    const path = await uploadImage(uploadedImage);

    const newCometaObj = cometaImages;
    newCometaObj[lastTouched[0]][lastTouched[1]] = path;
    
    nImages++;
    if(nImages === 4) await finishCometa();
    else await updateCometa(cometaID, newCometaObj, nImages);
}
$('#uploadB').on('change', uploadButtonTrigger);