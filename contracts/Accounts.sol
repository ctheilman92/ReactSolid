pragma solidity ^0.4.4;

contract Accounts {
  address Owner;

  mapping(address => User) mUsers;
  address[] Users;

  mapping(bytes32 => Status) mStatus;
  bytes32[] StatusesByHash;

  struct Status {
    uint timeStamp;
    string message;
  }

  struct User {
    string handle;
    bytes32[] statusList;
  }

  function addNewUser(string _handle) returns (bool success) {
    address newUserAddr = msg.sender;
    
    //if handle not in userAddresses & the handle is not null
    if (bytes(mUsers[msg.sender].handle).length == 0 && bytes(_handle).length != 0) {
      mUsers[newUserAddr].handle = _handle;
      Users.push(newUserAddr);
      return true;
    } else {
      return false;
    }
  }

  function addStatusToUser(string _msg, bytes32 SHA256StatusHash) returns (bool success) {
    address saveAddr = msg.sender;

    //if user exists in address and the message is not null
    if (bytes(mUsers[saveAddr].handle).length != 0 && bytes(_msg).length != 0) {
      if (bytes(_msg).length != 0) {
        StatusesByHash.push(SHA256StatusHash);

        mStatus[SHA256StatusHash].message = _msg;
        mStatus[SHA256StatusHash].timeStamp = block.timestamp;
        return true;
      } else { return false; }
      return true;
    } else { return false; }
  }

  //region getters
  function getUsers() constant returns (address[]) {
    return Users;
  }

  function getUser(address userAddr) constant returns (string, bytes32[]) {
    return (
      mUsers[userAddr].handle,
      mUsers[userAddr].statusList
    );
  }

  function getUserStatuses(address userAddr) constant returns (bytes32[]) {
    return mUsers[userAddr].statusList;
  } 

  function getAllStatuses() constant returns (bytes32[]) {
    return StatusesByHash;
  }

  function getStatus(bytes32 SHA256StatusHash) constant returns (string) {
    return mStatus[SHA256StatusHash].message;
  }
  //endregion
}