import React from 'react';
import axios from './axios';
import {Link} from 'react-router-dom';

export class SearchUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {draftSearch: ''};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
        var self = this;
        console.log("text: ", self[e.target.name] + '%');
        if (self[e.target.name] != '') {
            axios.post('/search', {text: self[e.target.name] + '%'}).then(results => {
                if (results.data.error) {
                    self.setState({
                        error: true
                    });
                } else {
                    if (results.data.rows.length == 0) {
                        self.setState({
                            users: []
                        });
                    } else {
                        self.setState({
                            users: results.data.rows
                        });
                    }
                }
            });
        } else {
            self.setState({
                users: []
            });
        }
    }
    render() {
        return (
            <div className="searchUsers">

                <div className="searchUsersListContainer">

                    <h1>Search other sock-lovers!</h1>
                    <input name="searchbar" onChange={this.handleChange} />

                    {this.state.error && <div className="error">Oops, something went wrong!</div>}

                    {this.state.users && this.state.users.length > 0 && <div className="searchUsersList">
                        {this.state.users && this.state.users.map(
                            i => {
                                return (
                                    <div key={i.id} className="searchUserItem">
                                        {<Link to={`/user/${i.id}`} key={i.id}>
                                            <div className="searchUserItemPicture">
                                                <img src={i.url || "/profilepic.png"} />
                                            </div>
                                            <div className="searchUserItemInfo">
                                                <h2>{i.first} {i.last}</h2>
                                            </div>
                                        </Link>}
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
