var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Login = artifacts.require("./Login.sol")
module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Login);
};
