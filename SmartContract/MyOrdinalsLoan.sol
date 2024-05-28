// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    struct NFTMetadata {
        uint64 id;
        address owner;
        string name;
        string uri;
        string inscription_number;
        string inscription_id;
        string content;
        string content_type;
        uint64 location_blockheight;
    }

    mapping(uint256 => NFTMetadata) private _tokenDetails;
    mapping(string => bool) private _inscriptionExists;
    mapping(string => bool) private _burnedInscriptionExists;
    mapping(string => bool) private _approvedCollections;
    mapping(string => bool) private _collectionNames;

    event NFTMinted(uint256 indexed tokenId, address owner, string inscription_id);
    event NFTBurned(uint256 indexed tokenId, string inscription_id);
    event CollectionApproved(string collectionName);

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(
        address recipient,
        string memory name,
        string memory uri,
        string memory inscription_number,
        string memory inscription_id,
        string memory content,
        string memory content_type,
        uint64 location_blockheight
    ) public onlyOwner returns (uint256) {
        require(!_inscriptionExists[inscription_id], "NFT with this inscription ID already exists");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);

        NFTMetadata memory newNFT = NFTMetadata({
            id: uint64(newItemId),
            owner: recipient,
            name: name,
            uri: uri,
            inscription_number: inscription_number,
            inscription_id: inscription_id,
            content: content,
            content_type: content_type,
            location_blockheight: location_blockheight
        });

        _tokenDetails[newItemId] = newNFT;
        _inscriptionExists[inscription_id] = true;

        emit NFTMinted(newItemId, recipient, inscription_id);

        return newItemId;
    }

    function burnNFT(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");

        NFTMetadata memory nftMetadata = _tokenDetails[tokenId];
        string memory inscription_id = nftMetadata.inscription_id;

        _burn(tokenId);

        delete _tokenDetails[tokenId];
        delete _inscriptionExists[inscription_id];
        _burnedInscriptionExists[inscription_id] = true;

        emit NFTBurned(tokenId, inscription_id);
    }

    function transferNFT(address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        _transfer(ownerOf(tokenId), to, tokenId);
        _tokenDetails[tokenId].owner = to;
    }

    function nftExistsByInscription(string memory inscription_id) public view returns (bool) {
        return _inscriptionExists[inscription_id];
    }

    function burnedNftExistsByInscription(string memory inscription_id) public view returns (bool) {
        return _burnedInscriptionExists[inscription_id];
    }

    function existsInCollection(uint256 tokenId, string memory collectionName) public view returns (bool) {
        require(_approvedCollections[collectionName], "Collection is not approved");
        return _exists(tokenId);
    }

    function addApprovedCollection(string memory collectionName) public onlyOwner {
        require(!_collectionNames[collectionName], "Collection name must be unique");
        _approvedCollections[collectionName] = true;
        _collectionNames[collectionName] = true;

        emit CollectionApproved(collectionName);
    }

    function getTokenDetails(uint256 tokenId) public view returns (NFTMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenDetails[tokenId];
    }
}
