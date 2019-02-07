import axios from './axios';

export function receiveFriendsList() {
    return axios.get('/friends/list').then(results => {
        return {
            type: "RECEIVE_FRIENDS_WANNABEES",
            list: results.data.rows
        };
    });
}

export function acceptFriendRequest(wannabe_id) {
    return axios.post('/friendshipstatus/' + wannabe_id + '/update', {action: 'ACCEPT FRIEND REQUEST'}).then(() => {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id: wannabe_id
        };
    });
}

export function unFriend(friend_id) {
    return axios.post('/friendshipstatus/' + friend_id + '/update', {action: 'REMOVE FRIEND'}).then(() => {
        return {
            type: "REMOVE_FRIEND",
            id: friend_id
        };
    });
}
