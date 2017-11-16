pragma solidity ^0.4.4;

//everything payable in ether is broken down in to Wei -- the smallest unit of ether
//1 Ether == 1000000000000000000 wei

contract AccountsPayable {

    //the contract needs ether to send and receive this will be a mapping of ether for the contract to use


    mapping(bytes32 => Payment) public mPayments;
    bytes32[] public PaymentsByHash;

    mapping(address => User) public mUsers;
    address[] public UsersByAddress;


    struct Payment {
        uint timeStamp;
        uint amount;
        address payTo;
        string memo;
        bool isPaid;
    }

    struct User {
        bool isVendor;
        string handle;
        uint funds;
        bytes32[] paymentsList;
    }

    function getUserBalance() constant returns (uint) {
        address owner = msg.sender;
        return owner.balance;
    }

    function addNewUser(string _handle, bool _isVendor) returns (bool success) {
        address newUserAddr = msg.sender;
        uint getBalance = newUserAddr.balance;

        //if handle not in userAddresses & the handle is not null
        if (bytes(mUsers[newUserAddr].handle).length == 0 && bytes(_handle).length != 0) {
            mUsers[newUserAddr].handle = _handle;
            mUsers[newUserAddr].isVendor = _isVendor;
            mUsers[newUserAddr].funds = getBalance;
            UsersByAddress.push(newUserAddr);
            return true;
        } 
        else {
            return false;
        }
    }

    //generate random sha256 32byte string to pass in
    //pass in biller, and payer addresses (must be registered)
    function addPaymentToUser(address _billTo, address _payTo, string _memo, bytes32 SHA256PaymentHash) returns (bool success) {

        //check mUsers for registered users for both biller and payer
        if (bytes(mUsers[_billTo].handle).length != 0 && bytes(mUsers[_payTo].handle).length != 0) {
            if (bytes(_memo).length != 0 && bytes(mPayments[SHA256PaymentHash].memo).length == 0) {
                PaymentsByHash.push(SHA256PaymentHash);

                mPayments[SHA256PaymentHash].memo = _memo;
                mPayments[SHA256PaymentHash].timeStamp = block.timestamp;
                mPayments[SHA256PaymentHash].isPaid = false;
                mPayments[SHA256PaymentHash].payTo = _payTo;

                mUsers[_billTo].paymentsList.push(SHA256PaymentHash);
            } else {
                return false; //either memo passed in was empty or there was already a memo saved for this account
            }
        } else {
            return false; //either sender or receiver was not a registered user
        }
    }

    //try using the following call
    //eth.sendTransaction({from:sender, to:receiver, value: amount})
    //so just use web3 object and run this afterward to return the new user balance
    // function payBill(address receiverAddr) returns (bool success) {
    //     return true
    // }

    //gets
    function getUsers() constant returns (address[]) {
        return UsersByAddress;
    }

    function getPayments() constant returns (bytes32[]) {
        return PaymentsByHash;
    }

    function getUserDetails(address userAddr) constant returns (string, bool, uint, bytes32[]) {
        return (
            mUsers[userAddr].handle,
            mUsers[userAddr].isVendor,
            mUsers[userAddr].funds,
            mUsers[userAddr].paymentsList
        );
    }
    
    function getPaymentDetails(bytes32 SHA256PaymentHash) constant returns (uint, uint, address, string, bool) {
        return (
            mPayments[SHA256PaymentHash].timeStamp,
            mPayments[SHA256PaymentHash].amount,
            mPayments[SHA256PaymentHash].payTo,
            mPayments[SHA256PaymentHash].memo,
            mPayments[SHA256PaymentHash].isPaid
        );
    }

    function getUserPayments(address userAddr) constant returns (bytes32[]) {
        return mUsers[userAddr].paymentsList;
    }
}