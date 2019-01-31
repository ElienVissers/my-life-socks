import React from 'react';
import axios from './axios';

export class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.uploadFile = this.uploadFile.bind(this);
    }
    uploadFile(e) {
        e.preventDefault();
        var file = document.getElementById('file');
        var uploadedFile = file.files[0];
        // use the formData API to send files to server --> pass it a key value pair with the key as a description and the value the file you want to send
        var formData = new FormData();
        formData.append('uploadedFile', uploadedFile);

        axios.post('/profilepic/upload', formData).then(response => {
            this.props.changePictureUrl(response.data);
        });
    }
    render() {
        return (
            <div>
                <h1>Change profile picture</h1>
                <input id="file" type="file" />
                <button onClick={this.uploadFile}>UPLOAD</button>
            </div>
        );
    }
}
