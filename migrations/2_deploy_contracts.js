var Accounts = artifacts.require("./Accounts.sol")
var AccountsPayable = artifacts.require("./AccountsPayable.sol")

module.exports = function(deployer) {
  deployer.deploy(Accounts);
  deployer.deploy(AccountsPayable);
};
