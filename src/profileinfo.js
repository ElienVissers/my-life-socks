import React from 'react';

import {BioEditor} from './bioeditor';
import {FavouriteSocks} from './favouritesocks';

export function ProfileInfo(props) {
    return (
        <div className="profileinfo">
            <h1>{props.first} {props.last}</h1>
            <BioEditor
                bio={props.bio}
                updateBio={props.updateBio}
            />
            <FavouriteSocks
                shape={props.shape}
                color={props.color}
                updateSocks={props.updateSocks}
                handleChange2={props.handleChange2}
            />
        </div>
    );
}
