require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

module.exports = {

    solidity: {
      compilers: [
        {
          version: "0.8.18", // One required version
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
        {
          version: "0.8.10", // Another required version
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
      ],
      overrides: {
        "contracts/Token.sol": {
          version: "0.8.9",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
        "contracts/PreSale.sol": {
          version: "0.8.20",
          settings: {
            optimizer: {
              enabled: true,
              runs: 200,
            },
          },
        },
      },
    },
  paths: {
    artifacts: "./src",
  },
  networks: {
    bnb: {
      url: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  sourcify: {
    enabled: true
  },  
  etherscan: {
    apiKey: {
      bnb: "your-etherscan-api-key",
    },
    customChains: [
      {
        network: "bnb",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com/",
        },
      },
    ],
  },
};