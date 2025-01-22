const { ethers } = require("hardhat");
const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {

  // Calculate start and end times
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
  const ninetyDaysInSeconds = 134 * 24 * 60 * 60; // 134 days in seconds
  const startTime = currentTime;
  const endTime = currentTime + ninetyDaysInSeconds;

  console.log(`Start Time (Unix Timestamp): ${startTime}`);
  console.log(`End Time (Unix Timestamp): ${endTime}`);

  // Get an instance of the Presale contract
  const presale = await ethers.getContractAt("PresaleEdu", presaleAddress);


  // Ensure the signer is the contract owner
  // Get the signer (assumes first signer is the contract owner)
  const [signer] = await ethers.getSigners();

  // Ensure the signer is the contract owner
  const owner = await presale.owner();
  console.log(owner);

  if (signer.address.toLowerCase() !== owner.toLowerCase()) {
    console.error("Caller is not the owner of the Presale contract!");
    return;
  }
    console.log(signer.address);
  if (signer.address !== owner) {
    console.error("Caller is not the owner of the Presale contract!");
    return;
  }
 
  // Call the changeSaleTimes function
  console.log("Setting up Time Constant");
  
  
  const tx1 = await presale.setTimeConstant(432000);
  await tx1.wait();

  console.log("Updating sale times..." + startTime + " End Time" + endTime);

  const tx = await presale.changeSaleTimes(startTime, endTime);
  await tx.wait();
  console.log("Sale times updated successfully!");
 
}

main().catch((error) => {
  console.error("Error during execution:", error);
  process.exitCode = 1;
});
