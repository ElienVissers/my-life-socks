import React from 'react';
import axios from './axios';

import {ProfilePic} from './profilepic';

export class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.uploadFile = this.uploadFile.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.showFilename = this.showFilename.bind(this);
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
    closeModal(e) {
        if (e.target == document.getElementById('uploader')) {
            this.props.toggleUploader();
        } else {
            return;
        }
    }
    showFilename() {
        console.log(document.getElementById('file').files[0].name);
        this.setState({
            filename: document.getElementById('file').files[0].name
        });
    }
    render() {
        return (
            <div onClick={this.closeModal} id="uploader">
                <div className="uploader-content">
                    <ProfilePic
                        first={this.props.first}
                        last={this.props.last}
                        pictureUrl={this.props.pictureUrl}
                        toggleUploader={this.props.toggleUploader}
                    />
                    <h3>Change profile picture</h3>
                    <label className="custom-file-upload">
                        <input
                            name="file-upload"
                            id="file"
                            type="file"
                            onChange={this.showFilename}
                        />
                            choose image
                    </label>
                    {this.state.filename && <div id="filename">{this.state.filename}</div>}
                    <button onClick={this.uploadFile}>UPLOAD</button>
                </div>
            </div>
        );
    }
}
