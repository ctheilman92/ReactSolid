import initialState from '../utils/store'

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
            console.log('attempting to add user')
            newState.isFetching = true
            return newState
        case 'REGISTER_USER_SUCCESS':
            console.log('from reducer: ' + action.payload)
            newState = action.payload
            newState.isFetching = false
            newState.isRegisteredUser = true
            return newState
        default:
            return state

    }
}