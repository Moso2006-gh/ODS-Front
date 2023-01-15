import './style.scss';

import homeScript from './scripts/home';
import coMetaScript from './scripts/coMeta';

const path = window.location.pathname;
if (path === "/home.html") homeScript();
else if (path === "/CoMeta.html") coMetaScript();