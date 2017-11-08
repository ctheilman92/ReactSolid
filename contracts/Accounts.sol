pragma solidity ^0.4.4;


// NOTE: CHANGE THIS CONTRACT TO HOLD A BILL-LIKE TO DO LIST -- USING VENDORS AND USERS ALONG WITH THE TASKS ALREADY SET UP AS REMINDERS -- INCORPORATE BILL PAYMENTS

contract Accounts {

  mapping(address => User) public mUsers;
  address[] public Users;               //users whitepages

  mapping(bytes32 => Task) public mTasks;
  bytes32[] public TasksByHash;         //tasks whitepages


  struct Task {
    uint timeStamp;
    string description;
    bool isComplete;
  }

  struct User {
    string handle;
    bytes32[] taskList;
  }

  function addNewUser(string _handle) returns (bool success) {
    address newUserAddr = msg.sender;
    
    //if handle not in userAddresses & the handle is not null
    if (bytes(mUsers[newUserAddr].handle).length == 0 && bytes(_handle).length != 0) {
      mUsers[newUserAddr].handle = _handle;
      Users.push(newUserAddr);
      return true;
    } else {
      return false;
    }
  }

  //best practice -- generate random sha256 32byte string to pass in
  //in this case the sha256hash will act as the global identity for this specific task
  function addTaskToUser(string _task, bytes32 SHA256TaskHash) returns (bool success) {
    address saveAddr = msg.sender;

    //check mUsers white pages for registered users
    if (bytes(mUsers[saveAddr].handle).length != 0) {
      if (bytes(_task).length != 0 && bytes(mTasks[SHA256TaskHash].description).length == 0) {
          TasksByHash.push(SHA256TaskHash); //add to tasks whitepages

          mTasks[SHA256TaskHash].description = _task;
          mTasks[SHA256TaskHash].timeStamp = block.timestamp;
          mTasks[SHA256TaskHash].isComplete = false;

          mUsers[saveAddr].taskList.push(SHA256TaskHash); //add the unique ID - task to the user's task list
      } else {
        return false; //task or notary was null or the notary was already saved for another task
      }
      return true;
    } else {
      return false; //user did not exist in registered users whoops
    }
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

  function getUserTasks(address userAddr) constant returns (bytes32[]) {
    return mUsers[userAddr].taskList;
  } 

  function getAllTasks() constant returns (bytes32[]) {
    return TasksByHash;
  }

  function getTask(bytes32 SHA256TaskHash) constant returns (string) {
    return mTasks[SHA256TaskHash].description;
  }
  //endregion
}