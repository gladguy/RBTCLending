const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {
  
    // Get an instance of the stakingContractV2 contract
    const stakingContract = await ethers.getContractAt("stakingManager", stakingManagerAddress);
    
    const owner = await stakingContract.owner();
    console.log("Current Owner:", owner);
  
    // Example function call to set a new claim start time
    const newClaimStart = 1737183201; // Example timestamp for claim start
    console.log("Setting new claim start to:", newClaimStart);
    const tx = await stakingContract.setClaimStart(newClaimStart);
    await tx.wait();
    console.log("Claim start updated successfully");
  

  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  