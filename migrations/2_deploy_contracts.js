var Accounts = artifacts.require("./Accounts.sol")
module.exports = function(deployer) {
  deployer.deploy(Accounts);
};
