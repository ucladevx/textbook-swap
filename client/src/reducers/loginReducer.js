import {USER_LOGIN} from '../actions/types'

export default function(state = null, action){
    console.log("In Reducer...");
    switch (action.type) {
        case USER_LOGIN:
            console.log("Received Login Action");
            console.log(action.payload);
            return action.payload || false
        default:
            return state;
    }
}
