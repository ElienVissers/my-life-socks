import React from 'react';
import axios from './axios';

import {Uploader} from './uploader';
import {Header} from './header';

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
