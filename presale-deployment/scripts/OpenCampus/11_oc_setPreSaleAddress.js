const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {
  
    // Get an instance of the stakingContractV2 contract
    const stakingContract = await ethers.getContractAt("stakingManager", stakingManagerAddress);
    
    const owner = await stakingContract.owner();
    console.log("Current Owner:", owner);
  
    // Example function call to set a new claim start time
    console.log("Trying to set Presale Address");
    const tx = await stakingContract.setPresale("0xF227d22D19F530D2547bE0Dd04732E22a6516B2F");
    await tx.wait();
    console.log("Presale address set successfully");
  

  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  