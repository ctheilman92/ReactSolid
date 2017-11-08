import AccountsContract from '../../build/contracts/Accounts.json'
import getWeb3 from '../utils/getWeb3'
import initialState from '../utils/store'

const contract = require('truffle-contract');
const util = require('util');


//#region action creators

//pass in initialState object for easy copying over reference
export const loadWeb3 = () => {
    let newState = initialState //emulate reducer pattern here boi -- GREAT IDEA CAM YEAH ITS 3AM WHY ARE YOU STILL UP


    return (dispatch, getState) => {
        dispatch(loadWeb3Request())
        getWeb3.then(res => { 
            newState.web3 = res.web3;
            newState.AccountsCtrct = contract(AccountsContract);
            newState.AccountsCtrct.setProvider(res.web3.currentProvider);
            newState.provider = res.web3.currentProvider;

            newState.web3.eth.getAccounts((error, accounts) => {
                newState.SenderAddress = accounts[0];

                let acctDeployed = newState.AccountsCtrct.deployed();
                acctDeployed.then(instance => {
                    return instance.getUsers(); }).then(users => {
                        newState.RegisteredAccounts = users;

                        if (newState.RegisteredAccounts.includes(newState.SenderAddress)) {
                            return newState.AccountsCtrct.deployed().then(inst2 => {
                                return inst2.getUser(newState.SenderAddress); }).then(detes => {
                                    newState.SenderHandle = detes[0];
                                    newState.isRegisteredUser = true;
                                    newState.isFetching = false;
                                    return dispatch(loadWeb3Success(newState))
                                })
                        }
                        else {
                            newState.isFetching = false;
                            return dispatch(loadWeb3Success(newState))
                        }
                    })
                })
            
            })
    }   
}
//#enregion
export const loadWeb3Request = () => {
    return {
        type: 'LOAD_WEB3_REQUEST'
    }
}

export const loadWeb3Success = (payload) => {
    return {
        type: 'LOAD_WEB3_SUCCESS',
        payload
    }
}


export const addUserTask = () => {
    return {
        type: 'ADD_TASK'
    }
}


export const getUsers = () => {
    return {
        type: 'GET_USER'
    }
}


export const getUserDetail = () => {
    return {
        type: 'GET_USER_DETAIL'
    }
}


export const getAllTasks = () => {
    return {
        type: 'GET_ALL_TASKS'
    }
}


export const getUserTasks = () => {
    return {
        type: 'GET_USER_TASKS'
    }
}


export const getTask = () => {
    return {
        type: 'GET_TASK'
    }
}


export const initWeb3 = () => {
    return {
        type: 'INIT_WEB3'
    }
}



