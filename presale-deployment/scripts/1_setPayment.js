const { ethers } = require("hardhat");

async function main() {
  // Address of your deployed contract
  const presaleAddress = "0xAeADfE0eA90AC0335040F9569F125649f140cb96";

  const presale = await ethers.getContractAt("PresaleV2", presaleAddress);
  
  const owner = await presale.owner();
  console.log("Current Owner:", owner);

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
}

// Run the script
main();
