const { ethers, upgrades } = require("hardhat");
const { BigNumber } = ethers;

async function main() {
  // Actual contract addresses (Replace with your real addresses)
  const rewardTokenAddress = "0x2c19518FC3CB9BdfD856DFF378E6590f4d4892D8"; // Address of the token to be staked
  const presaleContractAddress = "0xF3E1B0E4dEF3D14D60a79DaE6a7983b818D5E4f6"; // Address of the presale contract
/*
Banana Token 0x3b087C3f2FDF209d09Babd053aA6C81D6be5Bc0E
PreSale 0xAeADfE0eA90AC0335040F9569F125649f140cb96
Staking Address 0x543922c252c72434010B5bfd583A4799DDeeB814

0x2c19518FC3CB9BdfD856DFF378E6590f4d4892D8
0xF3E1B0E4dEF3D14D60a79DaE6a7983b818D5E4f6
*/
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
