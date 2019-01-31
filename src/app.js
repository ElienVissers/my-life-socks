import React from 'react';
import axios from './axios';

import {ProfilePic} from './profilepic';
import {Uploader} from './uploader';

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
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
    showUploader() {
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
            <div>
                <img src="/logo.png" />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    pictureUrl={this.state.pictureUrl}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && <Uploader changePictureUrl={this.changePictureUrl}/>}
            </div>
        );
    }
}
