pragma solidity ^0.4.2;

contract SimpleStorage {
  string savedString;

  function setString(string s) {
    savedString = s;
  }

  function getString() constant returns (string) {
    return savedString;
  }


}
