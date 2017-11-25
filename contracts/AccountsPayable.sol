pragma solidity ^0.4.4;

//everything payable in ether is broken down in to Wei -- the smallest unit of ether
//1 Ether == 1000000000000000000 wei

contract AccountsPayable {

    //the contract needs ether to send and receive this will be a mapping of ether for the contract to use
    mapping(address => uint256) public balances;

    mapping(bytes32 => Payment) public mPayments;
    bytes32[] public PaymentsByHash;

    mapping(address => User) public mUsers;
    address[] public UsersByAddress;

    event LogPaymentProcessed (
        address _payer,
        address _receiver,
        uint _balance
    );

    //event PayToReceiver

    struct Payment {
        uint timeStamp;
        uint amount;
        address billTo;
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
        } else {
            return false;
        }
    }


    function tryDeposit() payable returns (bool success) {
        address userAddr = msg.sender;

        require (userAddr.balance > msg.value);
        balances[msg.sender] += msg.value;
        return true;
    }

    /*
        this one works -- we must pass in the payment amount as {value: paymentDetails[1]} instead of looking it up in here.
    */
    function payout(bytes32 paymentHash) payable returns (bool success) {
        address userAddr = msg.sender;
        address payTo = mPayments[paymentHash].payTo;

        require (mPayments[paymentHash].isPaid == false);
        require (mPayments[paymentHash].billTo == userAddr);
        require (userAddr.balance > msg.value);
        

        payTo.transfer(msg.value);
        mPayments[paymentHash].isPaid = true;

        LogPaymentProcessed(msg.sender, payTo, msg.value);
        return true;
    }


    // --generate random sha256 32byte string to pass in
    // --pass in _amount using web3 ----> web3.toWei(99.99, 'ether')
    function addPaymentToUser(address _billTo, address _payTo, uint _amount, string _memo, bytes32 SHA256PaymentHash) returns (bool success) {

        //check mUsers for both biller and payer
        if (bytes(mUsers[_billTo].handle).length != 0 && bytes(mUsers[_payTo].handle).length != 0) {
            if (bytes(_memo).length != 0) {
                PaymentsByHash.push(SHA256PaymentHash);

                mPayments[SHA256PaymentHash].memo = _memo;
                mPayments[SHA256PaymentHash].timeStamp = block.timestamp;
                mPayments[SHA256PaymentHash].isPaid = false;
                mPayments[SHA256PaymentHash].billTo = _billTo;
                mPayments[SHA256PaymentHash].payTo = _payTo;
                mPayments[SHA256PaymentHash].amount = _amount;
                
                // -- both user and vendor will be connected ot the same payment address
                mUsers[_billTo].paymentsList.push(SHA256PaymentHash);
                mUsers[_payTo].paymentsList.push(SHA256PaymentHash);
            } else {
                return false; //either memo passed in was empty or there was already a memo saved for this account
            }
        } else {
            return false; //either sender or receiver was not a registered user
        }
    }

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
    
    function getPaymentDetails(bytes32 SHA256PaymentHash) constant returns (uint, uint, address, address, string, bool) {
        return (
            mPayments[SHA256PaymentHash].timeStamp,
            mPayments[SHA256PaymentHash].amount,
            mPayments[SHA256PaymentHash].billTo,
            mPayments[SHA256PaymentHash].payTo,
            mPayments[SHA256PaymentHash].memo,
            mPayments[SHA256PaymentHash].isPaid
        );
    }

    function getUserPayments(address userAddr) constant returns (bytes32[]) {
        return mUsers[userAddr].paymentsList;
    }
}