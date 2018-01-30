import AccountsPayableContract from '../../build/contracts/AccountsPayable.json'
import getWeb3 from '../utils/getWeb3'
import initialState from '../utils/APStore'

const contract = require('truffle-contract');
const util = require('util');
const bignumber = require('bignumber.js');
const wei = new bignumber('1000000000000000000');
const randomString = require('randomstring');

//#region THUNK ASYNC ACTION CREATORS
export const loadWeb3 = () => {
  let newState = initialState

  return (dispatch, getState) => {
    dispatch({type: 'LOAD_WEB3_REQUEST'});
    getWeb3.then(res => {

      newState.web3 = res.web3;
      newState.AccountsCtrct = contract(AccountsPayableContract);
      newState
        .AccountsCtrct
        .setProvider(res.web3.currentProvider);
      newState.provider = res.web3.currentProvider;

      newState
        .web3
        .eth
        .getAccounts((error, accounts) => {
          newState.SenderAddress = accounts[0];

          let acctp = newState
            .AccountsCtrct
            .deployed();
          acctp.then(instance => {
            return instance.getUsers();
          }).then(users => {
            newState.RegisteredAccounts = users;

            if (newState.RegisteredAccounts.includes(newState.SenderAddress)) {
              return newState
                .AccountsCtrct
                .deployed()
                .then(inst2 => {
                  return inst2.getUserDetails(newState.SenderAddress);
                })
                .then(detes => {

                  newState.SenderHandle = detes[0];
                  newState.SenderType = (detes[1] === true)
                    ? 'VENDOR'
                    : 'USER';
                  newState.isRegisteredUser = true;
                  newState
                    .web3
                    .eth
                    .getBalance(newState.SenderAddress, (error, result) => {
                      if (!error) {
                        console.log('YOUR BALANCE: ' + result);
                        newState.SenderBalance = result
                      } else {
                        console.log('error grabbing account balance')
                      }
                    });

                  let userPayments = detes[3];
                  if (userPayments.length > 0) {
                    let pmntsProcessed = 0;

                    userPayments.map(p => {
                      newState
                        .AccountsCtrct
                        .deployed()
                        .then(inst3 => {
                          return inst3.getPaymentDetails(p);
                        })
                        .then(detail => {

                          //grab the other participant address from the details
                          let otherAddress = (newState.SenderAddress === detail[2])
                            ? detail[3]
                            : detail[2];
                          newState
                            .AccountsCtrct
                            .deployed()
                            .then(inst4 => {
                              console.log('OTHER ADDRESS ON LOADWEB3: ' + otherAddress)
                              return inst4
                                .getUserDetails(otherAddress)
                                .then(oad => {
                                  let pmntObject = {
                                    paymentHash: p,
                                    timeStamp: detail[0],
                                    amount: detail[1],
                                    billTo: detail[2],
                                    payTo: detail[3],
                                    memo: detail[4],
                                    isPaid: detail[5],
                                    partyAddress: oad[0]
                                  };

                                  newState
                                    .SenderPayments
                                    .push(pmntObject);
                                  pmntsProcessed++;

                                  if (pmntsProcessed === userPayments.length) {
                                    return dispatch({type: 'LOAD_WEB3_SUCCESS', payload: newState});
                                  }
                                })
                            })
                        })
                    })
                  } else {
                    return dispatch({type: 'LOAD_WEB3_SUCCESS', payload: newState});
                  }
                })
            } else {
              //if it reaches this point well no prob
              return dispatch({type: 'LOAD_WEB3_SUCCESS', payload: newState});
            }
          })
        })
    }).catch((error) => {
      console.log('ERROR: ' + error)
      return dispatch({type: 'LOAD_WEB3_ERROR'});
    })
  }
}

export const registerNewUser = (handle, isVendor) => {
  return (dispatch, getState) => {
    let currState = getState().accounts;
    dispatch({type: 'REGISTER_USER_REQUEST'});

    //async register
    let acctp = currState
      .AccountsCtrct
      .deployed();
    acctp.then(inst => {
      return inst.addNewUser(handle, isVendor, {from: currState.SenderAddress});
    }).then(res => {
      let tmpAccounts = currState
        .RegisteredAccounts
        .slice();

      //append new user to registered accounts
      tmpAccounts.concat(currState.SenderAddress);
      currState.RegisteredAccounts = tmpAccounts;
      currState.SenderHandle = handle;
      currState.SenderType = (isVendor === true)
        ? 'VENDOR'
        : 'USER';
      currState
        .web3
        .eth
        .getBalance(currState.SenderAddress, (error, result) => {
          if (!error) {
            currState.SenderBalance = result;
            return dispatch({type: 'REGISTER_USER_SUCCESS', payload: currState});
          } else {
            console.log('error grabbing account balance')
          }
        });
    }).catch((error) => {
      console.log('ERROR: ' + error)
      return dispatch({type: 'REGISTER_USER_ERROR'});
    })
  }
}

export const addPaymentToUser = (inputAddress, amount, memo) => {
  return (dispatch, getState) => {
    let currState = getState().accounts;
    dispatch({type: 'ADD_PAYMENT_REQUEST'});

    let acctp = currState
      .AccountsCtrct
      .deployed();
    acctp.then(inst => {
      //generate payment hash value (randomstring)
      let paymentHash = randomString.generate(25);
      let amtToWei = currState
        .web3
        .toWei(amount, 'ether');
      let billTo,
        payTo;

      if (currState.SenderType === 'VENDOR') {
        billTo = inputAddress;
        payTo = currState.SenderAddress;
      } else {
        billTo = currState.SenderAddress;
        payTo = inputAddress;
      }

      return inst
        .addPaymentToUser(billTo, payTo, amtToWei, memo, paymentHash, {from: currState.SenderAddress})
        .then(() => {
          return acctp.then(inst2 => {
            return inst2
              .getPaymentDetails(paymentHash)
              .then(dete => {
                let otherAddress = (currState.SenderAddress === billTo)
                  ? payTo
                  : billTo;

                //try to get the name on the other account
                acctp.then(inst3 => {
                  return inst3
                    .getUserDetails(otherAddress)
                    .then(oad => {
                      //payment json object
                      let pmntObject = {
                        paymentHash: paymentHash,
                        timeStamp: dete[0],
                        amount: dete[1],
                        billTo: dete[2],
                        payTo: dete[3],
                        memo: dete[4],
                        isPaid: dete[5],
                        partyAddress: oad[0]
                      };

                      currState
                        .SenderPayments
                        .push(pmntObject);

                      //supposing all goes well wihtout checks -- return successful state
                      return dispatch({type: 'ADD_PAYMENT_SUCCESS', payload: currState});
                    });
                })
              })
          }).catch(error => {
            console.log('ERROR' + error)
            return dispatch({type: 'ADD_PAYMENT_ERROR'});
          })
        })
    }).catch(error => {
      console.log('ERROR' + error)
      return dispatch({type: 'ADD_PAYMENT_ERROR'});
    })
  }
}

export const processPayout = (pmnt) => {
  return (dispatch, getState) => {
    let currState = getState().accounts;
    dispatch({type: 'PROCESS_PAYOUT_REQUEST', payload: pmnt.paymentHash});

    let acctp = currState
      .AccountsCtrct
      .deployed();
    acctp.then(inst => {
      return inst
        .payout(pmnt.paymentHash, {
        from: currState.SenderAddress,
        value: pmnt.amount
      })
        .then(res => {
          // if success we can try to update the existing payment record in redux store we
          // can exclude the current saved payments that don't match the payment Hash
          let currPmnts = currState
            .SenderPayments
            .filter(statepmnt => {
              return statepmnt.paymentHash !== pmnt.paymentHash
            });

          // we'll set this to as the new currState.SenderPayments then push the updated
          // payment record
          let updatePmnt = currState
            .SenderPayments
            .filter(statepmnt => {
              return statepmnt.paymentHash === pmnt.paymentHash
            });
          updatePmnt[0].isPaid = true;
          console.log('UPDATED PAYMENT RECORD: ' + util.inspect(updatePmnt))

          // first push previous payments to currState --- then push updated payment record
          // to currState too.
          currState.SenderPayments = currPmnts;
          currState
            .SenderPayments
            .push(updatePmnt[0]);
          console.log('RETURNED SENDER PAYMENTS LIST: ' + util.inspect(currState.SenderPayments))
          return dispatch({type: 'PROCESS_PAYOUT_SUCCESS', payload: currState})
        })
        .catch((error) => {
          console.log('ERROR: ' + error)
          return dispatch({type: 'REGISTER_USER_ERROR'});
        })
    }).catch((error) => {
      console.log('ERROR: ' + error)
      return dispatch({type: 'REGISTER_USER_ERROR'});
    })
  }
}
//#endregion
