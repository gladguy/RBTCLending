// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyOrdinalLoan is ERC721Enumerable,  Ownable(0xf4694b507903977337883DD4517c0CB1d544Ab42)  {
    bool public MintIsActive = false;
    uint256 public constant MAX_ORDINALS = 200000000;
    uint256 public maxOrdinals = MAX_ORDINALS;
    string private baseURI;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        baseURI = name;
    }   


     

    function flipMintState() public onlyOwner {
        MintIsActive = !MintIsActive;
    }


    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);

        for (uint256 i = 0; i < ownerTokenCount; i++) {
            ownedTokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return ownedTokenIds;
    }

    function mintOrdinal(uint256 _inscriptionNumber) public {
        require(MintIsActive, "Mint must be active to mint a RootStock Ordinal");
        require(totalSupply() < maxOrdinals, "Mint would exceed max supply of RootStock Ordinal");

        _safeMint(msg.sender, _inscriptionNumber);
    }
}
