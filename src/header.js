import React from 'react';

import {ProfilePic} from './profilepic';

export function Header(props) {
    return (
        <header>
            <div className="header-content">
                <img src="/logo.png" />
                <h1>My Life Socks!</h1>
                <ProfilePic
                    first={props.first}
                    last={props.last}
                    pictureUrl={props.pictureUrl}
                    openUploader={props.openUploader}
                />
            </div>
            <div className="line">
            </div>
        </header>
    );
}

//make the logo a Link to the homepage == users profile --> <Link to="/"><img .../></Link> and wrap everything in a BrowserRouter tag
