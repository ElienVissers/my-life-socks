import React from 'react';

import {ProfilePic} from './profilepic';
import {ProfileInfo} from './profileinfo';

export function Profile(props) {
    return (
        <div className="profile">
            <div className="profile-components">
                <ProfilePic
                    first={props.first}
                    last={props.last}
                    pictureUrl={props.pictureUrl}
                    openUploader={props.openUploader}
                />
                <ProfileInfo
                    first={props.first}
                    last={props.last}
                    bio={props.bio}
                    updateBio={props.updateBio}
                />
            </div>
        </div>
    );
}

//<div className="line"></div>
