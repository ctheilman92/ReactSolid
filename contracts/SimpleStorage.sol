pragma solidity ^0.4.2;

contract SimpleStorage {
  uint storedData;
  string savedString;

  //region storedData IN
  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint) {
    return storedData;
  }
  //endregion

  function setString(string s) {
    savedString = s;
  }

  function getString() returns (string) {
    return savedString;
  }

}
