var AccountsPayable = artifacts.require("./AccountsPayable.sol")

module.exports = function(deployer) {
  deployer.deploy(AccountsPayable);
};
