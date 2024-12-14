// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTLending is ERC721Holder, Ownable(0x82b2E26E6e97D5700fDE6F640b24599b8A48D769) {
    using Counters for Counters.Counter;
    Counters.Counter private _offerIds;

    struct Lending {
        address lender;
        address borrower;
        uint256 tokenId;
        uint256 dueDate;
        bool isActive;
    }

    struct LendingOffer {
        uint256 offerId;
        address nftContract;
        uint256 tokenId;
        address lender;
        uint256 duration;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Lending)) public lendings; // NFT contract address => Token ID => Lending
    mapping(uint256 => LendingOffer) public lendingOffers; // Offer ID => LendingOffer

    event NFTLent(address indexed lender, address indexed borrower, address indexed nftContract, uint256 tokenId, uint256 dueDate);
    event NFTReturned(address indexed lender, address indexed borrower, address indexed nftContract, uint256 tokenId);
    event LendingOfferCreated(uint256 indexed offerId, address indexed lender, address indexed nftContract, uint256 tokenId, uint256 duration);
    event LendingOfferAccepted(uint256 indexed offerId, address indexed borrower, address indexed nftContract, uint256 tokenId);

    function createLendingOffer(address nftContract, uint256 tokenId, uint256 duration) external {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You do not own this NFT");

        _offerIds.increment();
        uint256 offerId = _offerIds.current();

        LendingOffer memory newOffer = LendingOffer({
            offerId: offerId,
            nftContract: nftContract,
            tokenId: tokenId,
            lender: msg.sender,
            duration: duration,
            isActive: true
        });

        lendingOffers[offerId] = newOffer;

        emit LendingOfferCreated(offerId, msg.sender, nftContract, tokenId, duration);
    }

    function acceptLendingOffer(uint256 offerId) external {
        LendingOffer storage offer = lendingOffers[offerId];
        require(offer.isActive, "This lending offer is not active");

        IERC721 nft = IERC721(offer.nftContract);
        require(nft.ownerOf(offer.tokenId) == offer.lender, "Lender does not own this NFT");

        nft.safeTransferFrom(offer.lender, address(this), offer.tokenId);

        Lending memory newLending = Lending({
            lender: offer.lender,
            borrower: msg.sender,
            tokenId: offer.tokenId,
            dueDate: block.timestamp + offer.duration,
            isActive: true
        });

        lendings[offer.nftContract][offer.tokenId] = newLending;
        offer.isActive = false;

        emit NFTLent(offer.lender, msg.sender, offer.nftContract, offer.tokenId, newLending.dueDate);
        emit LendingOfferAccepted(offerId, msg.sender, offer.nftContract, offer.tokenId);
    }

    function returnNFT(address nftContract, uint256 tokenId) external {
        Lending storage lending = lendings[nftContract][tokenId];
        require(lending.isActive, "This NFT is not lent out");
        require(lending.borrower == msg.sender || lending.dueDate < block.timestamp, "You are not the borrower or the due date has not passed");

        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(address(this), lending.lender, tokenId);

        lending.isActive = false;

        emit NFTReturned(lending.lender, lending.borrower, nftContract, tokenId);
    }

    function forceReturnNFT(address nftContract, uint256 tokenId) external onlyOwner {
        Lending storage lending = lendings[nftContract][tokenId];
        require(lending.isActive, "This NFT is not lent out");

        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(address(this), lending.lender, tokenId);

        lending.isActive = false;

        emit NFTReturned(lending.lender, lending.borrower, nftContract, tokenId);
    }
}
