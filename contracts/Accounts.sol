pragma solidity ^0.4.4;

contract Accounts {
  address Owner;

  mapping(address => User) mUsers;
  address[] Users;

  mapping(bytes32 => Task) mTask;
  bytes32[] TasksByHash;

  struct Task {
    uint timeStamp;
    string description;
  }

  struct User {
    string handle;
    bytes32[] taskList;
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

  function addStatusToUser(string _task, bytes32 SHA256TaskHash) returns (bool success) {
    address saveAddr = msg.sender;

    //if user exists in address and the description is not null
    if (bytes(mUsers[saveAddr].handle).length != 0 && bytes(_task).length != 0) {
      if (bytes(_task).length != 0) {
        TasksByHash.push(SHA256TaskHash);

        mTask[SHA256TaskHash].description = _task;
        mTask[SHA256TaskHash].timeStamp = block.timestamp;
        return true;
      } else {return false;}
      return true;
    } else {return false;}
  }

  //region getters
  function getUsers() constant returns (address[]) {
    return Users;
  }

  function getUser(address userAddr) constant returns (string, bytes32[]) {
    return (
      mUsers[userAddr].handle,
      mUsers[userAddr].taskList
    );
  }

  function getUserTask(address userAddr) constant returns (bytes32[]) {
    return mUsers[userAddr].taskList;
  } 

  function getAllTasks() constant returns (bytes32[]) {
    return TasksByHash;
  }

  function getTask(bytes32 SHA256TaskHash) constant returns (string) {
    return mTask[SHA256TaskHash].description;
  }
  //endregion
}