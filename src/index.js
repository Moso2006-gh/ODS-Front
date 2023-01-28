import './style.scss';

import homeScript from './scripts/home';
import coMetaScript from './scripts/coMeta';

const path = window.location.pathname.split('/');
console.log(path[path.length - 1]);
if (path[path.length - 1] === "home.html") homeScript();
else if (path[path.length - 1] === "CoMeta.html") coMetaScript();