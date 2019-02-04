import React from 'react';

import {ProfilePic} from './profilepic';

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <header>
                <div className="header-content">
                    <div className="logoname">
                        <img src="/logo.png" />
                        <h1>My Life Socks!</h1>
                    </div>
                    <div className="nav">
                        <ProfilePic
                            first={this.props.first}
                            last={this.props.last}
                            pictureUrl={this.props.pictureUrl}
                            openUploader={this.props.openUploader}
                        />
                        <p >Profile</p>
                        <p>Logout</p>
                    </div>
                </div>
                <div className="line">
                </div>
            </header>
        );
    }

}

//make the logo a Link to the homepage == users profile --> <Link to="/"><img .../></Link> and wrap everything in a BrowserRouter tag
