import React from 'react';
import {receiveFriendsList, acceptFriendRequest, unFriend} from './actions';
import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsList());
    }
    render() {
        if (!this.props.wannabes || !this.props.friends) {
            return null;
        }
        return (
            <div className="friendsList">

                <div className="friendsListContainer">
                    {this.props.wannabes.length > 0 && <h1>Pending friend requests:</h1>}
                    {this.props.wannabes && <div className="wannabeContainer">
                        {this.props.wannabes && this.props.wannabes.map(
                            i => {
                                return (
                                    <div key={i.id} className="wannabeItem">
                                        {<Link to={`/user/${i.id}`} key={i.id}><div className="wannabeItemPicture">
                                            <img src={i.url || "/profilepic.png"} />
                                        </div>
                                        </Link>}
                                        <div className="wannabeItemInfo">
                                            <h2>{i.first} {i.last}</h2>
                                            <button onClick={
                                                () => this.props.dispatch(acceptFriendRequest(i.id))
                                            }>ACCEPT</button>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                        <div className="emptyDiv"></div>
                    </div>}
                </div>

                <div className="friendsListContainer">
                    {this.props.friends.length > 0 && <h1>Fellow sock-lovers:</h1>}
                    {this.props.friends && <div className="friendContainer">
                        {this.props.friends && this.props.friends.map(
                            i => {
                                return (
                                    <div key={i.id} className="friendItem">
                                        {<Link to={`/user/${i.id}`} key={i.id}><div className="friendItemPicture">
                                            <img src={i.url || "/profilepic.png"} />
                                        </div>
                                        </Link>}
                                        <div className="friendItemInfo">
                                            <h2>{i.first} {i.last}</h2>
                                            <button onClick={
                                                () => this.props.dispatch(unFriend(i.id))
                                            }>REMOVE FRIEND</button>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                        <div className="emptyDiv"></div>
                    </div>}
                </div>

            </div>
        );
    }
}

//this function will run everytime the redux state is updated
const mapStateToProps = function(state) {
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
