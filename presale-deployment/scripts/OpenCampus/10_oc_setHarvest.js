const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {
  
    // Get an instance of the stakingContractV2 contract
    const stakingContract = await ethers.getContractAt("stakingManager", stakingManagerAddress);
    
    const owner = await stakingContract.owner();
    console.log("Current Owner:", owner);
  
    // Example function call to set a new claim start time
    console.log("Trying to unlock the harvest");
    const tx = await stakingContract.setHarvestLock(true);
    await tx.wait();
    console.log("Harvest is unlocked successfully");
  

  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  