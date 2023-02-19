import '../pages/styles/home.scss'

import $ from "jquery";
import { createCometaDoc, getRandomCometa } from '../utils/firebase.utils';

export default function homeScript() {
    async function createCoMeta() {
        const id = await createCometaDoc()
        let loc = window.location.href.replace(/home.html/, '');
        window.location.href = loc + 'CoMeta.html?co-meta=' + id
    }

    $('#createCometa').on('click', createCoMeta)

    requestAnimationFrame(animateCometas)
}

let oldDate = new Date();
let lastCometa = 0;
const speed = 1.0;

function animateCometas() {
    const newDate = new Date();
    oldDate = newDate;

    if((newDate - lastCometa) / 1000 > 3) {
        lastCometa = newDate;
        spawnCometa();
    }

    const cometasToupdate = $('.cometaDiv')
    cometasToupdate.toArray() .forEach(cometa => {
        let pos = [
            parseInt($(cometa).css('left')),
            parseInt($(cometa).css('bottom'))
        ]

        pos[0] += speed;
        pos[1] += speed;

        if(pos[0] > innerWidth + 100) $(cometa).remove()
        $(cometa).css({left: pos[0] + "px", bottom: pos[1] + "px"})
    });

    requestAnimationFrame(animateCometas)
}


const loadedCometas = [];
let lastPos = 0, lastUrl = 0;
async function spawnCometa() {
    console.log('a');
    let url;
    if(loadedCometas.length < 15) {
        url = await getRandomCometa();
        loadedCometas.push(url);
    }
    else {
        url = loadedCometas[Math.floor(Math.random()*loadedCometas.length)];
        while( url===lastUrl ) url = loadedCometas[Math.floor(Math.random()*loadedCometas.length)];
        lastUrl = url;
    }

    if(url !== null) {
        const bottomArr = [-10, 0, 10, 20, 30, 40, 50]

        let bottom = bottomArr[Math.floor(Math.random() * bottomArr.length)];
        while(bottom === lastPos) bottom = bottomArr[Math.floor(Math.random() * bottomArr.length)];
        console.log(bottom);
        
        $('#cometas').append(`
            <div class="cometaDiv" style="left: -200px; bottom: ${bottom}vh">
                <img class="mainCometa" src=${url}>
                <svg class="tail" xmlns="http://www.w3.org/2000/svg" width="367" height="254" viewBox="0 0 367 254">
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <path d="M364,3S270,43,249,118s-89,86-133,80S26,218,3,251" fill="none" stroke="#1d1d1b" stroke-linecap="round" stroke-miterlimit="10" stroke-width="6"/>
                      </g>
                    </g>
                  </svg>    
            </div>
        `)
        lastPos = bottom;
    }
}