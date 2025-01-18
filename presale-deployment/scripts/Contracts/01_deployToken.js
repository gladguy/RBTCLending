const { ethers } = require("hardhat");

async function main() {
  // Deploy the Token contract
  const Token = await ethers.getContractFactory("ZomatoToken");
  console.log("Deploying ZomatoToken...");
  const token = await Token.deploy(); // Example constructor arguments
  await token.deployed();
  console.log(`Token deployed to: ${token.address}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
