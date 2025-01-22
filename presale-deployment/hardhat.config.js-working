require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");

module.exports = {
    solidity: {
      version: "0.8.9", // Match your Solidity version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200, // Lower values minimize size, higher values optimize for runtime gas
        },
      },
    },  

  networks: {
    bnb: {
      url: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY], // Replace with your private key      
    }
  },
  etherscan: {
    apiKey: "TKCFUSYAM22CFN3RH5I1V4CX27F1G9FQFI", // Replace with your BscScan API key
  },
};