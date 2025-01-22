const { ethers, upgrades } = require("hardhat");
const { BigNumber } = ethers;

async function main() {
  // Actual contract addresses (Replace with your real addresses)
  const rewardTokenAddress = "0xE8757009B81ff24B1BD030375b06b3047735B95c"; // Address of the token to be staked
  const presaleContractAddress = "0xEEE7E850AE2f93e2e7955a6919a2AFcd940b3812"; // Address of the presale contract


  // Reward tokens per block (Ensure token has 18 decimals)
  //const rewardTokensPerBlock = ethers.utils.parseUnits("10", 18); // 10 tokens with 18 decimals
  

  const rewardTokensPerBlock = "1000000000000000000000"; // 1000 tokens with 18 decimals
  const lockTime = 86400 * 30; // Lock time in seconds (30 days)
  const endBlock = 56994782; // Replace with the block number for rewards stopping
  console.log("Reward Tokens Per Block:", rewardTokensPerBlock.toString());

  // Log deployment start
  console.log("Deploying stakingManager...");

  // Get contract factory
  const StakingManager = await ethers.getContractFactory("stakingManager");

  // Deploy the upgradeable proxy
  const stakingManager = await upgrades.deployProxy(
    StakingManager,
    [rewardTokenAddress, presaleContractAddress, rewardTokensPerBlock, lockTime, endBlock],
    { initializer: "__stakingManager_init" }
  );

  // Wait for deployment
  await stakingManager.deployed();

  // Log the deployed address
  console.log(`stakingManager deployed to: ${stakingManager.address}`);
}

// Run the deployment
main()
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
  });
