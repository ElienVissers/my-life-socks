export function reducer(state={}, action) {

    if (action.type == "RECEIVE_FRIENDS_WANNABEES") {
        state = { ...state, friendsList : action.list };
        return state;
    }

    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        return { ...state, friendsList: state.friendsList.map(
            i => {
                if (i.id == action.id) {
                    return {...i, accepted: true};
                } else {
                    return i;
                }
            }
        )};
    }

    if (action.type == 'REMOVE_FRIEND') {
        return { ...state, friendsList: state.friendsList.filter(
            i => {
                if (i.id == action.id) {
                    return false;
                } else {
                    return true;
                }
            }
        )};
    }

    if (action.type == "ADD_USER_ID") {
        state = { ...state, userId : action.userId };
        return state;
    }

    if (action.type == 'CREATE_ONLINE_USERS_LIST') {
        state = { ...state, onlineUsers : action.users };
        return state;
    }

    if (action.type == 'ADD_ONLINE_USERS_LIST') {
        state = { ...state, onlineUsers : state.onlineUsers.concat(action.user) };
        return state;
    }

    if (action.type == 'REMOVE_ONLINE_USERS_LIST') {
        state = { ...state, onlineUsers : state.onlineUsers.filter(
            i => {
                if (i.id == action.id) {
                    return false;
                } else {
                    return true;
                }
            }
        ) };
        return state;
    }

    if (action.type == 'LOAD_CHAT_MESSAGES') {
        state = { ...state, chatMessages : action.messages.reverse() };
        return state;
    }

    if (action.type == 'ADD_CHAT_MESSAGE') {
        state = { ...state, chatMessages : state.chatMessages.concat(action.newMessage) };
        return state;
    }

    if (action.type == 'LOAD_FRIEND_MESSAGES') {
        state = { ...state, friendMessages : action.messages.reverse() };
        return state;
    }

    if (action.type == 'ADD_FRIEND_MESSAGE') {
        state = { ...state, friendMessages : state.friendMessages.concat(action.newMessage) };
        return state;
    }

    if (action.type == 'RECENT_FRIEND') {
        state = { ...state, recentFriend : true };
        return state;
    }

    if (action.type == 'RECENT_FRIEND_REMOVE') {
        state = { ...state, recentFriend : false };
        return state;
    }

    return state;
}
