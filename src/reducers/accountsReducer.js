import initialState from '../utils/APStore'

const contract = require('truffle-contract');   // eslint-disable-line
const util = require('util');                   // eslint-disable-line



export default (state = initialState, action) => {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case 'LOAD_WEB3_REQUEST':
            return Object.assign({}, state, { isFetching: true })
        case 'LOAD_WEB3_SUCCESS':
            newState = action.payload
            newState.isFetching = false
            return newState
        case 'LOAD_WEB3_ERROR':
            console.log('there was an issue connecting to web3')
            newState.isFetching = true
            return newState
        case 'REGISTER_USER_REQUEST':
            newState.isFetching = true
            return newState
        case 'REGISTER_USER_SUCCESS':
            newState = action.payload
            newState.isFetching = false
            newState.isRegisteredUser = true
            return newState
        case 'REGISTER_USER_ERROR':
            console.log('there was an issue creating this user')
            newState.isFetching = true
            return newState
        case 'ADD_PAYMENT_REQUEST':
            newState.isFetching = true
            return newState
        case 'ADD_PAYMENT_SUCCESS':
            newState = action.payload
            newState.isFetching = false
            return newState
        case 'ADD_PAYMENT_ERROR':
            console.log('there was an issue creating a payment ofr this user')
            newState.isFetching = true
            return newState
        case 'PROCESS_PAYOUT_REQUEST':
            newState.isFetching = true
            return newState
        case 'PROCESS_PAYOUT_SUCCESS':
            newState = action.payload
            newState.isFetching = false
            return newState
        case 'PROCESS_PAYOUT_ERROR':
            console.log('there was an issue creating a payment ofr this user')
            newState.isFetching = true
            return newState
        default:
            return state

    }
}