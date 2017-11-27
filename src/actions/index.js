import AccountsPayableContract from '../../build/contracts/AccountsPayable.json'
import getWeb3 from '../utils/getWeb3'
import initialState from '../utils/APStore'

const contract = require('truffle-contract');
const util = require('util');
const bignumber = require('bignumber.js');
const wei = new bignumber('1000000000000000000');


//#region THUNK ASYNC ACTION CREATORS
export const loadWeb3 = () => {
    let newState = initialState

    return (dispatch, getState) => {
        dispatch({ type: 'LOAD_WEB3_REQUEST' });
        getWeb3.then(res => { 

            newState.web3 = res.web3;
            newState.AccountsCtrct = contract(AccountsPayableContract);
            newState.AccountsCtrct.setProvider(res.web3.currentProvider);
            newState.provider = res.web3.currentProvider;

            newState.web3.eth.getAccounts((error, accounts) => {
                newState.SenderAddress = accounts[0];

                let acctp = newState.AccountsCtrct.deployed();
                acctp.then(instance => { 
                    return instance.getUsers(); }).then(users => {
                        newState.RegisteredAccounts = users;
                        
                        if (newState.RegisteredAccounts.includes(newState.SenderAddress)) {
                            return newState.AccountsCtrct.deployed().then(inst2 => {
                                return inst2.getUserDetails(newState.SenderAddress); }).then(detes => {

                                    newState.SenderHandle = detes[0];
                                    newState.isRegisteredUser = true;
                            
                                    let userPayments = detes[3];
                                    if (userPayments.length > 0) {
                                        let pmntsProcessed = 0;

                                        userPayments.map(p => {
                                            newState.AccountsCtrct.deployed().then(inst3 => {
                                                return inst3.getPaymentDetails(p); }).then(detail => {
                                                    let calcVal = detail[1] / wei;
                                                    newState.SenderPayments.push(detail);
                                                    pmntsProcessed++;

                                                    if (pmntsProcessed === userPayments.length) {
                                                        return dispatch({
                                                            type: 'LOAD_WEB3_SUCCESS',
                                                            payload: newState
                                                        });
                                                    }
                                                })
                                        })
                                    }
                                    else {
                                        return dispatch({
                                            type: 'LOAD_WEB3_SUCCESS',
                                            payload: newState
                                        });
                                    }
                                })
                        }
                        else {
                            //if it reaches this point well no prob
                            return dispatch({
                                type: 'LOAD_WEB3_SUCCESS',
                                payload: newState
                            });
                        }
                    })
            })
        }).catch((error) => {
            console.log('ERROR: ' + error)
            return dispatch({ type: 'LOAD_WEB3_ERROR' });
        })
    }
}

export const registerNewUser = (handle, isVendor) => {
    return (dispatch, getState) => {
        let currState = getState().accounts;
        dispatch({ type: 'REGISTER_USER_REQUEST' });

        //async register 
        let acctp = currState.AccountsCtrct.deployed();
        acctp.then(inst => {
            return inst.addNewUser(handle, isVendor, {from: currState.SenderAddress}); }).then(res => {
                let tmpAccounts = currState.RegisteredAccounts.slice();
                
                //append new user to registered accounts
                tmpAccounts.concat(currState.SenderAddress);
                currState.RegisteredAccounts = tmpAccounts;
                currState.SenderHandle = handle;
                currState.SenderType = isVendor;

                console.log('FROM addUser tempAccounts: ' + tmpAccounts)
                console.log('FROM addUser state registeredAccounts: ' + currState.RegisteredAccounts)

                return dispatch({
                    type: 'REGISTER_USER_SUCCESS',
                    payload: currState
                });
            }).catch((error) => {
                console.log('ERROR: ' + error)
                return dispatch({ type: 'REGISTER_USER_ERROR' });
            })
    }
}

//#endregion
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



