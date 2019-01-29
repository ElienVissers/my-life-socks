import React from 'react';
import ReactDOM from 'react-dom';

import {Welcome} from './welcome';

let compToRender;

if (location.pathname == '/welcome') {
    compToRender = <Welcome />;
} else {
    compToRender = <img src="/logo.png" />;
}

ReactDOM.render(
    compToRender,
    document.querySelector('main')
);
