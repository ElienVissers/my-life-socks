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
                    toggleUploader={props.toggleUploader}
                />
            </div>
            <div className="line">
            </div>
        </header>
    );
}
