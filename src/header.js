import React from 'react';
import {Link} from 'react-router-dom';
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
                        <Link to="/" id="profileLink"><p>{this.props.first}</p></Link>
                        <p>Friends</p>
                        <a href="/logout" id="logoutLink"><p>Logout</p></a>
                    </div>
                </div>
                <div className="line">
                </div>
            </header>
        );
    }

}
