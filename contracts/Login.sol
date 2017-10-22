pragma solidity ^0.4.4;


// follow https://github.com/auth0-blog/ethereum-login-sample/blob/master/solidity/contracts/Login.sol
contract Login {
    event loginAttempt(address sender, string challenge);

    function login(string challenge) {
        loginAttempt(msg.sender, challenge);
    }
}