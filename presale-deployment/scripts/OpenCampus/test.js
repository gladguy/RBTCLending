const { ethers } = require("hardhat");

async function main() {
  // Address of your deployed contract
  const presaleAddress = "0x816e695015D72e672073CF80Ad56bD087308dAF0";

  const presale = await ethers.getContractAt("PresaleV2", presaleAddress);
  
  console.log(presale);
  const owner = await presale.owner();
  console.log("Current Owner:", owner);

  /*
  // Replace with the new payment wallet address
  const newPaymentWallet = owner;

  try {
    // Send transaction to change the payment wallet
    const tx = await presale.changePaymentWallet(newPaymentWallet);
    console.log("Transaction sent! Waiting for confirmation...");
    await tx.wait();
    console.log("Payment wallet updated successfully!");
    console.log(`Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.error("Error updating payment wallet:", error);
  }
  */
}

// Run the script
main();
