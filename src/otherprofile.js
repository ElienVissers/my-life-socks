import React from 'react';
import axios from './axios';

import {FriendButton} from './friendbutton';

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        var self = this;
        axios.get('/user/' + this.props.match.params.id + '.json').then(results => {
            if (results.data.redirectTo) {
                self.props.history.push(results.data.redirectTo);
            }
            if (results.data.rows.length == 0) {
                self.setState({
                    invalidOtherUserId: true
                });
            } else {
                self.setState({
                    id: results.data.rows[0].id,
                    first: results.data.rows[0].first,
                    last: results.data.rows[0].last,
                    pictureUrl: results.data.rows[0].url || '/profilepic.png',
                    bio: results.data.rows[0].bio || 'No bio yet.',
                    shape: results.data.rows[0].shape,
                    color: results.data.rows[0].color
                });
            }
        }).catch(err => {
            console.log('error in mount otherprofile: ', err);
        });
    }
    render() {
        console.log("otherUserId: ", this.props.match.params.id);
        return (
            <div className="otherprofilediv">
                {this.state.invalidOtherUserId && <div className="error">Oops! This isn&apos;t a registered sock-lover.</div>}

                {this.state.id && <div className="otherprofile">
                    <div className="profilepiccontainer">
                        <img src={this.state.pictureUrl} />
                    </div>
                    <div className="otherprofileinfo">
                        <h1>{this.state.first} {this.state.last}</h1>
                        <pre>{this.state.bio}</pre>
                        {this.state.color && <div>
                            <h5>Favourite Socks:</h5>
                            <div style={{backgroundColor: this.state.color, width: "50px", height: "50px"}}></div>
                        </div>}
                        <FriendButton otherUserId={this.props.match.params.id} />
                    </div>
                </div>}
            </div>
        );
    }
}
