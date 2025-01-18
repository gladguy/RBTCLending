const { saleToken, stakingManagerAddress, presaleAddress } = require("./config");

async function main() {
    const claimStart = Math.floor(Date.now() / 1000); // + 3600; // 1 hour from now
    //const noOfTokens = ethers.utils.parseUnits("10000", 18); // 10,000 tokens
    var noOfTokens = "1600000000"; // 10 tokens with 18 decimals


    // Get an instance of the PresaleV2 contract
    const presale = await ethers.getContractAt("PresaleV3", presaleAddress);
  
    const owner = await presale.owner();
    console.log("Current Owner:", owner);

    // Approve tokens first
    const token = await ethers.getContractAt("IERC20Upgradeable", saleToken);
    //console.log("Current token:", token);
    console.log("PreSale Address:", presaleAddress);

    const balance = await token.balanceOf(owner);
    console.log("Balance:", balance);


    if(balance > 0)
    {
        await token.approve(presaleAddress, noOfTokens);
        console.log("Token approved");
        
        const tx = await presale.startClaim(claimStart, noOfTokens, saleToken, stakingManagerAddress);
        await tx.wait();
        
        console.log("Claim started successfully!");
    }
    else
    {
      console.log("Transfer the tokens from Staking Address to the Owner " + owner);
    }
   
  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  