import {USER_LOGIN} from '../actions/types'

export default function(state = null, action){
    console.log("In Reducer...");
    switch (action.type) {
        case USER_LOGIN:
            console.log("Received Login Action");
            console.log(action.payload);
            var obj = action.payload
            
            // COMMENT THIS OUT
//            obj.trades[0].status = 'A'
//            obj.trades[1].status = 'W'
//            obj.trades[2].status = 'R'
//            obj.trades[3].status = 'P'
            
            return obj || false
        default:
            return state;
    }
}
