const { ethers } = require("hardhat");
const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {
  // Address of your deployed contract
  const presale = await ethers.getContractAt("PresaleEdu", presaleAddress);
  
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

    const setAdmin = await presale.setAdmin(newPaymentWallet);
    console.log("Transaction sent! Waiting for confirmation...");
    await setAdmin.wait();
    console.log("Payment wallet updated successfully!");
    console.log(`Transaction hash: ${setAdmin.hash}`);


    console.log("Now, transfer all the tokens except from staking to the PreSale Address " , presaleAddress)
  } catch (error) {
    console.error("Error updating payment wallet:", error);
  } 
}

// Run the script
main();
