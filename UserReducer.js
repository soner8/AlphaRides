import { combineReducers } from 'redux';

const INITIAL_STATE = {
    currentUserName: "Doye",

};

const UserReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state
    }
};

export default combineReducers({
    User: UserReducer,
});