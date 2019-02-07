import axios from './axios';

export function receiveFriendsList() {
    console.log("about to make GET axios request");
    return axios.get('/friends/list').then(results => {
        console.log("results from /friends/list: ", results);
        return {
            type: "RECEIVE_FRIENDS_WANNABEES",
            list: results.data.rows
        };
    });
}

export function acceptFriendRequest(wannabe_id) {
    return axios.post('/friendshipstatus/' + wannabe_id + '/update', {action: 'ACCEPT FRIEND REQUEST'}).then(results => {
        console.log("results from acceptFriendRequest: ", results);
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id: wannabe_id
        };
    });
}

export function unFriend(friend_id) {
    return axios.post('/friendshipstatus/' + friend_id + '/update', {action: 'REMOVE FRIEND'}).then(results => {
        console.log("results from unFriendRequest: ", results);
        return {
            type: "REMOVE_FRIEND",
            id: friend_id
        };
    });
}
