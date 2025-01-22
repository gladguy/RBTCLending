// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract AirdropToken {
    address public owner;
    IERC20 public token;
    uint256 public airdropAmount = 100 * (10 ** 18); // Assuming token has 18 decimals
    mapping(address => bool) public hasClaimed;

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Constructor to set the contract owner and token address
    constructor() {
        owner = msg.sender;        
    }

    // Function to update airdrop amount
    function setAirdropToken(address _tokenAddress) public onlyOwner {
        token = IERC20(_tokenAddress);
    }

    // Function to claim airdrop
    function claim() public {
        require(!hasClaimed[msg.sender], "Airdrop already claimed");

        hasClaimed[msg.sender] = true; // Mark the user as having claimed the airdrop
        require(token.transfer(msg.sender, airdropAmount), "Token transfer failed");
    }

    // Function to update airdrop amount
    function setAirdropAmount(uint256 _amount) public onlyOwner {
        airdropAmount = _amount;
    }

    // Function to withdraw remaining tokens (onlyOwner)
    function withdrawTokens(uint256 _amount) public onlyOwner {
        require(token.transfer(owner, _amount), "Token transfer failed");
    }
}
