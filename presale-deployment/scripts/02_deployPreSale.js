const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const PresaleV2 = await ethers.getContractFactory("PresaleV2");
  const presale = await upgrades.deployProxy(PresaleV2, [], { initializer: "initialize" });

  await presale.deployed();
  console.log("PresaleV2 deployed to:", presale.address);
  console.log("Owner is:", await presale.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
