import AccountsContract from '../../build/contracts/Accounts.json'
import getWeb3 from './getWeb3'

const contract = require('truffle-contract');
const util = require('util');

class accountsAPI {
    static loadWeb3() {
        return getWeb3.then(results => {
            return results.json();
        }).catch(error => {
            return error;
        });
    }
}

export default accountsAPI;