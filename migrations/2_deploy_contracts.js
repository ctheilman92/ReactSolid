var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Accounts = artifacts.require("./Accounts.sol")
module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Accounts);
};
