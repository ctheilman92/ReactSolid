import AccountsContract from '../../build/contracts/Accounts.json'
import getWeb3 from '../utils/getWeb3'
import initialState from '../utils/store'

const contract = require('truffle-contract');
const util = require('util');



export default (state = initialState, action) => {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case 'LOAD_WEB3_REQUEST':
            return Object.assign({}, state, { isFetching: true })
        case 'LOAD_WEB3_SUCCESS':
            newState = action.payload
            return newState
        case 'REGISTER_USER':
            return state
        case 'ADD_TASK':
            console.log('task added')
            return state
        case 'GET_USER':
            console.log('user got')
            return state
        case 'GET_USER_DETAIL':
            console.log('user details got')
            return state
        case 'GET_ALL_TASKS':
            console.log('tasks white pages got')
            return state
        case 'GET_USER_TASKS':
            console.log('user specific tasks got')
            return state
        case 'GET_TASK':
            console.log('specific task got')
            return state
        default:
            return state

    }
}