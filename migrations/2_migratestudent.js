var Migrations = artifacts.require("./CrowdFunding.sol");
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
