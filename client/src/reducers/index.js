import { combineReducers } from 'redux';
import userLogin from './loginReducer'

export default combineReducers({
    user: userLogin
})
