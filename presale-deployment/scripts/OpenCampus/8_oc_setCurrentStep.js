const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {


    // Get an instance of the PresaleV2 contract
    const presale = await ethers.getContractAt("PresaleEdu", presaleAddress);
  
    const owner = await presale.owner();
    console.log("Current Owner:", owner);


    console.log("Check Point and Current step is set to 0 and 1");
    const tx = await presale.setCurrentStep(0,32000000);
    await tx.wait();
  
  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  