import React from 'react';

export function ProfilePic(props) {
    let url;
    if (props.pictureUrl === null) {
        url = "/profilepic.png";
    } else {
        url = props.pictureUrl;
    }
    let name = props.first + ' ' + props.last;
    return (
        <div id="profilepicimg" className="profilepic" onClick={props.openUploader}>
            <img id="profilepicimg" src={url} alt={name} />
        </div>
    );
}
