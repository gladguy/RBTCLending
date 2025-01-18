const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {
  
    // Get an instance of the stakingContractV2 contract
    const stakingContract = await ethers.getContractAt("stakingManager", stakingManagerAddress);
    
    const owner = await stakingContract.owner();
    console.log("Current Owner:", owner);
  
    // Example function call to set a new claim start time
    console.log("Trying to set Token contract");
    const tx = await stakingContract.setStakeToken("0xbE2eb2F27b1D1108871E3AA06CC072C04E979cA7");
    await tx.wait();
    console.log("Token contract is set successfully");
  

  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  