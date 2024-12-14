async function main() {
    const presaleAddress = "0xAeADfE0eA90AC0335040F9569F125649f140cb96"; // Deployed PresaleV2 contract address
    const stakingManagerAddress = "0x543922c252c72434010B5bfd583A4799DDeeB814"; // Deployed StakingManager contract address
  
    

    // Get an instance of the PresaleV2 contract
    const presale = await ethers.getContractAt("PresaleV2", presaleAddress);
  
    const owner = await presale.owner();
    console.log("Current Owner:", owner);


    console.log("Check Point and Current step is set to 0 and 1");
    const tx = await presale.setCurrentStep(1,0);
    await tx.wait();
  
  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  