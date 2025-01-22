const { ethers } = require("hardhat");
const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {

  const presale = await ethers.getContractAt("PresaleEdu", presaleAddress);
  
  const owner = await presale.owner();
  console.log("Current Owner:", owner);

  // Replace with the new payment wallet address 30000000000000000000000000
  const maxBuy = 32000000;

  try {
    // Send transaction to change the payment wallet
    const tx = await presale.changeMaxTokensToBuy(maxBuy);
    console.log("Transaction sent! Waiting for confirmation...");
    await tx.wait();
    console.log("Max Token updated  successfully!");
    console.log(`Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("Error updating payment wallet:", error);
  }
}

// Run the script
main();
