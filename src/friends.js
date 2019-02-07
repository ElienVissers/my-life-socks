import React from 'react';
import {receiveFriendsList, acceptFriendRequest, unFriend} from './actions';
import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log("component Friends is mounting");
        this.props.dispatch(receiveFriendsList());
    }
    render() {
        return (
            <div>
                <div className="wannabeeContainer">

                    {this.props.wannabes && this.props.wannabes.map(
                        i => {
                            return (
                                <div key={i.id}>
                                    {<Link to={`/user/${i.id}`} key={i.id}>{i.first} {i.last}</Link>}
                                    <button onClick={
                                        () => this.props.dispatch(acceptFriendRequest(i.id))
                                    }>ACCEPT</button>
                                </div>
                            );
                        }
                    )};

                </div>
                <div className="friendsContainer">

                    {this.props.friends && this.props.friends.map(
                        i => {
                            return (
                                <div key={i.id}>
                                    {<Link to={`/user/${i.id}`} key={i.id}>{i.first} {i.last}</Link>}
                                    <button onClick={
                                        () => this.props.dispatch(unFriend(i.id))
                                    }>REMOVE FRIEND</button>
                                </div>
                            );
                        }
                    )};

                </div>
            </div>
        );
    }
}

//this function will run everytime the redux state is updated
const mapStateToProps = function(state) {
    console.log("state in mapStateToProps: ", state);
    if (!state.friendsList) {
        return {};
    } else {
        return {
            friends: state.friendsList.filter(
                i => {
                    if (i.accepted) {
                        return true;
                    } else {
                        return false;
                    }
                }
            ),
            wannabes: state.friendsList.filter(
                i => {
                    if (!i.accepted) {
                        return true;
                    } else {
                        return false;
                    }
                }
            )
        };
    }
};


export let ConnectedFriends = connect(mapStateToProps)(Friends);
