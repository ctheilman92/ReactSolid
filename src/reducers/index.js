import { combineReducers } from 'redux';
import accountsReducer from './accountsReducer';

const rootReducer = combineReducers({
    accounts: accountsReducer,
});
export default rootReducer;