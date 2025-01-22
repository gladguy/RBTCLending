const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {

    // Get an instance of the PresaleV2 contract
    const presale = await ethers.getContractAt("PresaleEdu", presaleAddress);
  
    const owner = await presale.owner();
    console.log("Current Owner:", owner);


    console.log("Setting staking manager...");
    const tx = await presale.setStakingManager(stakingManagerAddress);
    await tx.wait();
  
    console.log("Staking manager set successfully:", stakingManagerAddress);
  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  