const { ethers } = require("hardhat");

async function main() {
  // Deploy the Token contract
  const Token = await ethers.getContractFactory("AirdropToken");
  console.log("Deploying Airdrop Token...");
  const token = await Token.deploy(); // Example constructor arguments
  await token.deployed();

  console.log(`Token deployed to: ${token}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
