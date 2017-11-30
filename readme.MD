# React Solid

Authors: Cameron Heilman, Adrian Rodriguez

**Application Summary**

Create an interface for Users and Commercial vendors to keep track and manage current bills and payments.
  
 
Requirements
-------------
 1. this project extends Web3.js. a Node.js library used to connect to the Ethereum Blockchain._
 2. ConsenSys TestRPC
 3. SolidityJS
 4. Truffle Compiler
 5. Web3.js
 6. NodeJS
 7. MetaMask Chrome Browser plugin
  
Getting Started
----------------
1. Open One Terminal
2. Clone repo and install npm modules
```shell
$ git clone https://github.com/ctheilman92/ReactSolid.git
$ cd ReactSolid
$ npm install
 ```
2. Start the TestRPC server
```shell
//for random generated mnemonic testnet
$ tesrpc 
//OR run our rpc script to get a static testRPC instance with the same 10 accounts every time
$ npm run rpc
```
3. Configure Metamask plugin for your current TESTRPC 
    ...select "private network > LOCALHOST 8545
4. Start React app 
```shell
$ npm start
```


Using the Truffle Console instead of Web App
-------------
_you can also deploy and interact with the contract through the truffle compiler (nodeJS shell + web3JS Library)_
1. make sure your TestRPC is up and running
```shell
$ truffle con
```
2. In the node js server you can pass through JS-Systax commands. deploy and run your contract
```javascript
var contract = AccountsPayable.deployed();
```
3. After your contract is deployed you can interact with it!...KINDA like we did in our code
```javascript
var user1 = web3.eth.accounts[0]
var isVendor = false;
contract.then(instance => { return instance.addNewUser('USER_HANDLE', true, {from: user1}); })

var registeredUsers
contract.then(instance => { return instance.getUsers(); }).then(u => { return registeredUsers = u; })
```

Known Bugs
--------------
1. Registered user Balance sometimes shows 0 ETH.
2. Nothing stops one vendor from creating a payment for another vendor (it would never be paid).
3. no test units written....whoops.

