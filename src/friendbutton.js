import React from 'react';
import axios from './axios';

export class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: "ADD FRIEND"
        };
        this.updateFriendship = this.updateFriendship.bind(this);
    }
    componentDidMount() {
        var self = this;
        axios.get('/friendshipstatus/' + this.props.otherUserId + '/initial').then(results => {
            if (results.data.rows.length !== 0) {
                if (results.data.rows[0].accepted) {
                    self.setState({
                        buttonText: "REMOVE FRIEND"
                    });
                } else {
                    if (results.data.rows[0].sender_id == this.props.otherUserId) {
                        self.setState({
                            buttonText: "ACCEPT FRIEND REQUEST"
                        });
                    } else {
                        self.setState({
                            buttonText: "CANCEL FRIEND REQUEST"
                        });
                    }
                }
            }
        });
    }
    updateFriendship() {
        var self = this;
        axios.post('/friendshipstatus/' + this.props.otherUserId + '/update', {action: self.state.buttonText}).then(() => {
            if (self.state.buttonText == 'ADD FRIEND') {
                self.setState({
                    buttonText: "CANCEL FRIEND REQUEST"
                });
            } else if (self.state.buttonText == 'CANCEL FRIEND REQUEST') {
                self.setState({
                    buttonText: "ADD FRIEND"
                });
            } else if (self.state.buttonText == 'ACCEPT FRIEND REQUEST') {
                self.setState({
                    buttonText: "REMOVE FRIEND"
                });
            } else if (self.state.buttonText == 'REMOVE FRIEND') {
                self.setState({
                    buttonText: "ADD FRIEND"
                });
            }
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.updateFriendship}>{this.state.buttonText}</button>
            </div>
        );
    }
}
