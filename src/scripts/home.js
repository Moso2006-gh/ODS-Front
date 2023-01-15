import $ from "jquery";
import { createCometaDoc } from '../utils/firebase.utils';

export default function homeScript() {
    async function createCoMeta() {
        const id = await createCometaDoc()
        $('#yourCometa').html('Your cometa is: ' + 'http://localhost:8080/CoMeta.html?co-meta=' + id)
    }

    $('#createCometa').on('click', createCoMeta)
}