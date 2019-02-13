import React from 'react';
import axios from './axios';
import {connect} from 'react-redux';
import {initSocket} from './socket';
import {removeRecentFriend} from './actions';

//send friendship_id as second argument with the newFriendMessageFromUserInput event

class FriendMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textOfMessage: '',
            friends: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.recentFriend != prevState.friends) {
            console.log("prevProps and prevState: ", prevProps, prevState);
            // this.setState({
            //     friends: true
            // });
        }
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    componentDidMount() {
        axios.get('/friendshipstatus/' + this.props.match.params.id + '/initial').then(results => {
            if (results.data.rows.length !== 0) {
                if (results.data.rows[0].accepted) {
                    this.setState({
                        friends: true
                    });
                    initSocket().emit('showFriendMessagesFromUserInput', this.props.match.params.id);
                }
            }
        });
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    componentWillUnmount() {
        this.props.dispatch(removeRecentFriend());
    }
    handleChange(e) {
        this.setState({
            textOfMessage: e.target.value
        });
    }
    sendMessage() {
        initSocket().emit('newFriendMessageFromUserInput', {text: this.state.textOfMessage, friendship_id: this.props.match.params.id});
        this.setState({
            textOfMessage: ''
        });
    }
    render() {
        if (!this.props.recentFriend && !this.state.friends) {
            return null;
        } else {
            return (
                <div className="friendMessagesBox">

                    <div className="friendMessagesContainer" >
                        {this.props.friendMessages.length == 0 && <p id="noMessagesP">There are no messages yet... send the first one!</p>}
                        {!!this.props.friendMessages.length && <div className="friendMessagesContainer-messages" ref={elem => this.elem = elem}>
                            {this.props.friendMessages && this.props.friendMessages.map(
                                msg => {
                                    return (
                                        <div key={msg.message_id} className="friendMessageItem">
                                            <div className="friendMessageItemPicture">
                                                <img src={msg.sender_url || '/profilepic.png'} />
                                            </div>
                                            <div className="friendMessageItemInfo">
                                                <p><span className="message-sender">{msg.sender_first} {msg.sender_last}</span> <span className="message-date">on {msg.message_created_at.slice(0,10)}, {msg.message_created_at.slice(14,19)}</span></p>
                                                <p className="message-content">{msg.message}</p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>}
                        <div className="friendMessageInput">
                            <textarea value={this.state.textOfMessage} onChange={this.handleChange} />
                            <button onClick={this.sendMessage}>SEND MESSAGE</button>
                        </div>
                    </div>

                </div>
            );
        }
    }
}

const mapStateToProps = function(state) {
    console.log("mapstatetoprops running", state.recentFriend);
    return {
        friendMessages: state.friendMessages || [],
        recentFriend: state.recentFriend
    };
};

export let ConnectedFriendMessages = connect(mapStateToProps)(FriendMessages);
