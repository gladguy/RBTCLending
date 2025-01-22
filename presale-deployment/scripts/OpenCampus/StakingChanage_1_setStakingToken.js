async function main() {
    const stakingManagerAddress = "0x543922c252c72434010B5bfd583A4799DDeeB814"; // Deployed StakingManager contract address
  
    const newTokenAddress = "0xAeADfE0eA90AC0335040F9569F125649f140cb96"; // Deployed PresaleV2 contract address

    // npx hardhat run scripts/StakingChanage_1_setStakingToken.js --network bnb
    // Get an instance of the stakingManager contract
    const presale = await ethers.getContractAt("stakingManager", stakingManagerAddress);
  
    const tokenAddress = await presale.stakeToken();
    console.log("Current Token Address:", tokenAddress);


    console.log("Changing Token Address ");
    //const tx = await presale.setStakeToken(newTokenAddress);
    await tx.wait();
  
  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  