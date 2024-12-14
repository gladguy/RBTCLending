async function main() {
    const claimStart = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    //const noOfTokens = ethers.utils.parseUnits("10000", 18); // 10,000 tokens
    var noOfTokens = "1599999999999993599936000004"; // 10 tokens with 18 decimals

    const saleToken = "0x3b087C3f2FDF209d09Babd053aA6C81D6be5Bc0E"; // Deployed token address
    const stakingManagerAddress = "0x543922c252c72434010B5bfd583A4799DDeeB814"; // Deployed staking manager address
    const presaleAddress = "0xAeADfE0eA90AC0335040F9569F125649f140cb96"; // Deployed PresaleV2 contract address
  
    // Get an instance of the PresaleV2 contract
    const presale = await ethers.getContractAt("PresaleV2", presaleAddress);
  
    const owner = await presale.owner();
    console.log("Current Owner:", owner);

    // Approve tokens first
    const token = await ethers.getContractAt("IERC20Upgradeable", saleToken);
    //console.log("Current token:", token);
    console.log("PreSale Address:", presaleAddress);

    const balance = await token.balanceOf(owner);
    console.log("Balance:", balance);

    // Token 0x3b087C3f2FDF209d09Babd053aA6C81D6be5Bc0E
    // Owner 0x34404182397C5f64de3bc3B80Dca8db28E2679CA


    if(balance > 0)
    {
        await token.approve(presaleAddress, 5*noOfTokens);
        console.log("Token approved");
        
        const tx = await presale.startClaim(claimStart, noOfTokens, saleToken, stakingManagerAddress);
        await tx.wait();
        
        console.log("Claim started successfully!");
    }
    else
    {
      console.log("Balance is zero");
    }
   
  }
  
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  