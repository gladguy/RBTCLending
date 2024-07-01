// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BorrowRequest is ERC721Holder, Ownable(0xf4694b507903977337883DD4517c0CB1d544Ab42)  {
    using Counters for Counters.Counter;
    Counters.Counter private _offerIds;

    struct Lending {
        address lender;
        address borrower;
        uint256 tokenId;
        uint256 dueDate;
        bool isActive;
    }

    struct BorrowRequest {
        uint256 requestId;
        address nftContract;
        uint256 tokenId;
        address lender;
        uint256 duration;
        uint256 loanAmount;
        uint256 repayAmount;
        uint256 platformFee;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Lending)) public lendings; // NFT contract address => Token ID => Lending
    mapping(uint256 => BorrowRequest) public borrowRequests; // Request ID => BorrowRequest

    event NFTLent(address indexed lender, address indexed borrower, address indexed nftContract, uint256 tokenId, uint256 dueDate);
    event NFTReturned(address indexed lender, address indexed borrower, address indexed nftContract, uint256 tokenId);
    event BorrowRequestCreated(uint256 indexed requestId, address indexed lender, address indexed nftContract, uint256 tokenId, uint256 duration, uint256 loanAmount, uint256 repayAmount, uint256 platformFee);
    event BorrowRequestAccepted(uint256 indexed requestId, address indexed borrower, address indexed nftContract, uint256 tokenId);
    event BorrowRequestPaid(address indexed borrower, address indexed lender, uint256 repayAmount, uint256 platformFee);

    function createBorrowRequest(address nftContract, uint256 tokenId, uint256 duration, uint256 loanAmount, uint256 repayAmount, uint256 platformFee) external {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You do not own this NFT");

        _offerIds.increment();
        uint256 requestId = _offerIds.current();

        BorrowRequest memory newRequest = BorrowRequest({
            requestId: requestId,
            nftContract: nftContract,
            tokenId: tokenId,
            lender: msg.sender,
            duration: duration,
            loanAmount: loanAmount,
            repayAmount: repayAmount,
            platformFee: platformFee,
            isActive: true
        });

        borrowRequests[requestId] = newRequest;

        emit BorrowRequestCreated(requestId, msg.sender, nftContract, tokenId, duration, loanAmount, repayAmount, platformFee);
    }

    function acceptBorrowRequest(uint256 requestId) external payable {
        BorrowRequest storage request = borrowRequests[requestId];
        require(request.isActive, "This borrow request is not active");
        require(msg.value == request.loanAmount, "Loan amount does not match");

        IERC721 nft = IERC721(request.nftContract);
        require(nft.ownerOf(request.tokenId) == request.lender, "Lender does not own this NFT");

        // Transfer loan amount to the lender
        payable(request.lender).transfer(msg.value);

        nft.safeTransferFrom(request.lender, address(this), request.tokenId);

        Lending memory newLending = Lending({
            lender: request.lender,
            borrower: msg.sender,
            tokenId: request.tokenId,
            dueDate: block.timestamp + request.duration,
            isActive: true
        });

        lendings[request.nftContract][request.tokenId] = newLending;
        request.isActive = false;

        emit NFTLent(request.lender, msg.sender, request.nftContract, request.tokenId, newLending.dueDate);
        emit BorrowRequestAccepted(requestId, msg.sender, request.nftContract, request.tokenId);
    }

    function returnNFT(address nftContract, uint256 tokenId) external payable {
        Lending storage lending = lendings[nftContract][tokenId];
        require(lending.isActive, "This NFT is not lent out");
        require(lending.borrower == msg.sender || lending.dueDate < block.timestamp, "You are not the borrower or the due date has not passed");

        BorrowRequest memory request = _getBorrowRequestByTokenId(nftContract, tokenId);
        require(msg.value == request.repayAmount, "Repay amount does not match");

        // Transfer the repay amount and platform fee
        uint256 lenderAmount = msg.value - request.platformFee;
        payable(lending.lender).transfer(lenderAmount);
        payable(owner()).transfer(request.platformFee);

        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(address(this), lending.lender, tokenId);

        lending.isActive = false;

        emit NFTReturned(lending.lender, lending.borrower, nftContract, tokenId);
        emit BorrowRequestPaid(msg.sender, lending.lender, request.repayAmount, request.platformFee);
    }

    function forceReturnNFT(address nftContract, uint256 tokenId) external onlyOwner {
        Lending storage lending = lendings[nftContract][tokenId];
        require(lending.isActive, "This NFT is not lent out");

        IERC721 nft = IERC721(nftContract);
        nft.safeTransferFrom(address(this), lending.lender, tokenId);

        lending.isActive = false;

        emit NFTReturned(lending.lender, lending.borrower, nftContract, tokenId);
    }

    function getBorrowRequestByTokenId(address nftContract, uint256 tokenId) external view returns (BorrowRequest memory) {
        for (uint256 i = 1; i <= _offerIds.current(); i++) {
            BorrowRequest storage request = borrowRequests[i];
            if (request.nftContract == nftContract && request.tokenId == tokenId) {
                return request;
            }
        }
        revert("BorrowRequest not found for this tokenId");
    }

    function _getBorrowRequestByTokenId(address nftContract, uint256 tokenId) internal view returns (BorrowRequest memory) {
        for (uint256 i = 1; i <= _offerIds.current(); i++) {
            BorrowRequest storage request = borrowRequests[i];
            if (request.nftContract == nftContract && request.tokenId == tokenId) {
                return request;
            }
        }
        revert("BorrowRequest not found for this tokenId");
    }
}
