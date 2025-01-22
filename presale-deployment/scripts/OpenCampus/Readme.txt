npx hardhat run ./scripts/OpenCampus/00_oc_deployAirdropToken.js --network edu-chain-testnet
npx hardhat verify --network edu-chain-testnet 0xC749380D26ec61243e228c5204CCdbfa0F3b33Ef

npx hardhat run ./scripts/OpenCampus/01_oc_deployToken.js --network edu-chain-testnet
npx hardhat verify --network edu-chain-testnet 0x09Da28A3D07d51037a89946E38B89f800210F2E4

0xE8757009B81ff24B1BD030375b06b3047735B95c
npx hardhat verify  --network edu-chain-testnet --contract contracts/LoanToken.sol:LoanToken 0xE8757009B81ff24B1BD030375b06b3047735B95c
 
npx hardhat run ./scripts/OpenCampus/02_oc_deployPreSale.js --network edu-chain-testnet
npx hardhat verify --network edu-chain-testnet 0xfe3705Bdb2860CB3D29374eF4e436E91131E0f9A
npx hardhat verify --network edu-chain-testnet 0xEEE7E850AE2f93e2e7955a6919a2AFcd940b3812

npx hardhat run ./scripts/OpenCampus/03_oc_deployStakingManager.js --network edu-chain-testnet
npx hardhat verify --network edu-chain-testnet 0xF1a67992df201250ca0534671183EC617732E401
npx hardhat verify --network edu-chain-testnet 0xA614E5DF52646dFdED527a0023692d7e9291645d

npx hardhat run ./scripts/OpenCampus/1_oc_setPayment.js --network edu-chain-testnet
npx hardhat run ./scripts/OpenCampus/3_oc_changeStartTime.js --network edu-chain-testnet
npx hardhat run ./scripts/OpenCampus/4_oc_setCurrentStep.js --network edu-chain-testnet

npx hardhat run ./scripts/OpenCampus/5_oc_setClaim.js --network edu-chain-testnet

npx hardhat run ./scripts/OpenCampus/6_oc_setStakingManager.js --network edu-chain-testnet

npx hardhat run ./scripts/OpenCampus/7_oc_setMaxBuy.js --network edu-chain-testnet
npx hardhat run ./scripts/OpenCampus/8_oc_setCurrentStep.js --network edu-chain-testnet

npx hardhat run ./scripts/OpenCampus/9_oc_setStakingClaim.js --network edu-chain-testnet
npx hardhat run ./scripts/OpenCampus/10_oc_setHarvest.js --network edu-chain-testnet


npx hardhat run ./scripts/OpenCampus/11_oc_setPreSaleAddress.js --network edu-chain-testnet

npx hardhat run ./scripts/OpenCampus/12_oc_setStakeToken.js --network edu-chain-testnet

npx hardhat run ./scripts/OpenCampus/test --network edu-chain-testnet