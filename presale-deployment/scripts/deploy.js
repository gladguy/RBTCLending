const { ethers, upgrades } = require("hardhat");

async function main() {
  const PresaleV2 = await ethers.getContractFactory("PresaleV2");

  // Deploy the proxy without calling an initializer
  console.log("Deploying upgradeable PresaleV2 with constructor...");
  const presaleV2 = await upgrades.deployProxy(PresaleV2, [], { initializer: false });

  console.log(`PresaleV2 deployed to: ${presaleV2.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



