import React from 'react';
import ReactDOM from 'react-dom';

import {Welcome} from './welcome';
import {App} from './app';

let compToRender;

if (location.pathname == '/welcome') {
    compToRender = <Welcome />;
} else {
    compToRender = <App />;
}

ReactDOM.render(
    compToRender,
    document.querySelector('main')
);
