import AccountsContract from '../../build/contracts/Accounts.json'
import getWeb3 from '../utils/getWeb3'
import initialState from '../utils/store'

const contract = require('truffle-contract');
const util = require('util');


//#region THUNK ASYNC ACTION CREATORS

export const loadWeb3 = () => {
    //we rely on the initialstate imported from our store 
    let newState = initialState

    return (dispatch, getState) => {
        //this will halt the app component from rendering until we finish our async task of fetching our data
        dispatch({ type: 'LOAD_WEB3_REQUEST' });


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
                                    let tasks = detes[1];

                                    
                                    if (tasks !== '') {
                                        return newState.AccountsCtrct.deployed().then(inst3 => {
                                            return inst3.getUserTasks(newState.SenderAddress); }).then(taskHashes => {
                                                let taskList = []
                                                taskHashes.map(t => { 
                                                    newState.AccountsCtrct.deployed().then(inst4 => {
                                                        return inst4.getTask(t); }).then(restask => { 
                                                            newState.SenderTaskList.push(restask)
                                                            return console.log('task details added' + newState.SenderTaskList)
                                                        })
                                                })

                                                return dispatch({
                                                    type: 'LOAD_WEB3_SUCCESS',
                                                    payload: newState
                                                })
                                            })
                                    }

                                    return dispatch({   
                                        type: 'LOAD_WEB3_SUCCESS',
                                        payload: newState
                                    })
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
            
            }).catch(() => {
                console.log('ERROR')
                return dispatch({ type: 'LOAD_WEB3_ERROR' });
            })
    }   
}

export const registerNewUser = (handle) => {
    return (dispatch, getState) => {
        let currState = getState().accounts;
        dispatch({ type: 'REGISTER_USER_REQUEST' });

        //async register used
        let acctDeployed = currState.AccountsCtrct.deployed();
        acctDeployed.then(instance => {
            return instance.addNewUser(handle, {from: currState.SenderAddress}); }).then(result => {
                let tmpAccounts = currState.RegisteredAccounts.slice()
                tmpAccounts.concat(currState.SenderAddress);
                currState.RegisteredAccounts = tmpAccounts
                console.log('FROM adduser tempAccounts: ' + tmpAccounts)
                console.log('FROM adduser state registeredAccounts: ' + currState.RegisteredAccounts)
                
                return dispatch({
                    type: 'REGISTER_USER_SUCCESS',
                    payload: currState
                })
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



