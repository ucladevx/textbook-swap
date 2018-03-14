import axios from 'axios'
import {USER_LOGIN} from './types'

const ROOT = 'http://www.loop-trading.com:3000'

// We use middlewares for the dispatch stuff w/ async network requests

export function userLogin(){
    return function(dispatch) {
        axios.get(ROOT+'/api/user_info')
            .then((res) => dispatch({
                type: USER_LOGIN,
                payload: res.data.data
            }))
    }
}
