const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Presale V3 with account:", deployer.address);

  const PresaleV3 = await ethers.getContractFactory("PresaleV3");
  const presale = await upgrades.deployProxy(PresaleV3, [], { initializer: "initialize" });

  await presale.deployed();
  console.log("PresaleV3 deployed to:", presale.address);
  console.log("Owner is:", await presale.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
