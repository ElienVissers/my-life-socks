export function reducer(state={}, action) {

    if (action.type == "RECEIVE_FRIENDS_WANNABEES") {
        const state = { ...state, friendsList : action.list };
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

    return state;
}
