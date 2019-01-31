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
        this.toggleUploader = this.toggleUploader.bind(this);
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
    toggleUploader() {
        this.setState(prevState => ({
            uploaderIsVisible: !prevState.uploaderIsVisible
        }));
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
                    toggleUploader={this.toggleUploader}
                />
                {this.state.uploaderIsVisible && <Uploader
                    first={this.state.first}
                    last={this.state.last}
                    pictureUrl={this.state.pictureUrl}
                    toggleUploader={this.toggleUploader}
                    changePictureUrl={this.changePictureUrl}
                />}
            </div>
        );
    }
}
