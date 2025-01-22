const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {


    // Get an instance of the PresaleV3 contract
    const presale = await ethers.getContractAt("PresaleEdu", presaleAddress);
  
    const owner = await presale.owner();
    console.log("Current Owner:", owner);


    console.log("Incrementing Current Step..");
    const tx = await presale.incrementCurrentStep();
    await tx.wait();
  
  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  