const { ethers } = require("hardhat");
const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {
  // Address of your deployed contract
  const presale = await ethers.getContractAt("ZomatoToken", saleToken);
  

  
  try {
    // Send transaction to change the payment wallet
    // const tx1 = await presale.approve(presaleAddress,stakingManagerAddress,1000);
    // await tx1.wait();
    // console.log(`Transaction hash: ${tx1.hash}`);

    const tx = await presale.transferFrom(presaleAddress,stakingManagerAddress,1000);
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
