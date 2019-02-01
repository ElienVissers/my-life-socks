import React from 'react';
import axios from './axios';

import {Uploader} from './uploader';
import {Header} from './header';
import {Profile} from './profile';

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.openUploader = this.openUploader.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        this.changePictureUrl = this.changePictureUrl.bind(this);
    }
    componentDidMount() {
        axios.get('./user').then(results => {
            this.setState({
                first: results.data.rows[0].first,
                last: results.data.rows[0].last,
                pictureUrl: results.data.rows[0].url
            });
        }).catch(err => {
            console.log('error in mount app: ', err);
        });
    }
    closeUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }
    openUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }
    changePictureUrl(url) {
        this.setState({
            pictureUrl: url,
            uploaderIsVisible: false
        });
    }
    render() {
        return (
            <div id="app">
                <Header
                    first={this.state.first}
                    last={this.state.last}
                    pictureUrl={this.state.pictureUrl}
                    openUploader={this.openUploader}
                />
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    pictureUrl={this.state.pictureUrl}
                    openUploader={this.openUploader}
                />
                <footer><h6>www.mylifesocks.com</h6></footer>
                {this.state.uploaderIsVisible && <Uploader
                    first={this.state.first}
                    last={this.state.last}
                    pictureUrl={this.state.pictureUrl}
                    closeUploader={this.closeUploader}
                    changePictureUrl={this.changePictureUrl}
                />}
            </div>
        );
    }
}

//new child of app: Profile
//Profile will have two children: ProfilePic and BioEditor
//when registered the bio (column or table) will be null --> "eddit you bio" is displayed
//click on it --> textarea and save button; when the button is clicked make axios request to save bio in db
//when it is saved in db, BioEditor needs to call a function updateBio() and pass it the new bio --> the bio will live in app's state ; the function will also show the saved bio and edit button

//bioEditor will have a state property similar to uploaderIsVisible --> editMode: true or false (show textarea and save button or not); bioExists: true or false (show "create bio" or show the bio and edit button) ==> conditional rendering within the bioEditor :)

//the bio content will live in apps state
//while typing: there is a previously saved bio and the currently being typed draftBio (can be a prop of bioEditor)
