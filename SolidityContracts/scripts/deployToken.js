const hre = require("hardhat");

async function main() {
  const deployedContract = await hre.ethers.deployContract("BananaToken");
  await deployedContract.waitForDeployment();
  console.log(`Banana Token contract deployed to ${deployedContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});