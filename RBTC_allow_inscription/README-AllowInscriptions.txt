RootStock Canister	: rcx6h-gqaaa-aaaam-actwa-cai
Private Key Account 	: 0x6470c4d86b062fF4e1030D5615c4B04cD78bF9Cf
Ordinals NFT Canister 	: 0x99Ed7c08c2310cD52188A0C94F6B01FC0a5dEC2D

allowInscription.js
1.This file fetchs the assets that need to be allowed for the particular user or authorized based on ethereum address
2.Call the contract function using the allowInscription.py file which uses hardhat with account mentioned (OpenAccount) in the metamask
3.Rootstock transaction details saved to the canister
4.Delete the ethereum address with inscription id from the canister

allowInscription.py
Call the contract with hardhat

python_rootstock.txt
This is written by allowInscription.py

command.js
Fetch the inscription and address from the canister
