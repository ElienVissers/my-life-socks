import React from 'react';

import {ProfilePic} from './profilepic';
import {ProfileInfo} from './profileinfo';

export function Profile(props) {
    return (
        <div className="profile">
            <ProfilePic
                first={props.first}
                last={props.last}
                pictureUrl={props.pictureUrl}
                openUploader={props.openUploader}
            />
            <ProfileInfo />
        </div>
    );
}
