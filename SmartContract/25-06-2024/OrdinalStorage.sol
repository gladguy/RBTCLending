// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol

pragma solidity ^0.8.0;

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

pragma solidity ^0.8.0;

contract OrdinalStorage is Ownable {
    struct Ordinal {
        uint256 inscriptionNumber;
        string inscription;
    }

    struct BitcoinInscription {
        string bitcoinAddress;
        uint256[] inscriptionNumbers;
    }

    struct EthereumToBitcoin {
        string bitcoinAddress;
    }

    Ordinal[] private ordinals;
    mapping(string => BitcoinInscription) private bitcoinInscriptions;
    mapping(address => EthereumToBitcoin) private ethToBtcMapping;
    mapping(string => address) private btcToEthMapping;

    address private allowedContract;
    string private ordinalBaseURI;

    modifier onlyAllowedContract() {
        require(msg.sender == allowedContract, "Caller is not the allowed contract");
        _;
    }

    function setAllowedContract(address _contract) public onlyOwner {
        allowedContract = _contract;
    }

    function storeOrdinal(uint256 _inscriptionNumber, string memory _inscription) public onlyAllowedContract {
        ordinals.push(Ordinal({
            inscriptionNumber: _inscriptionNumber,
            inscription: _inscription
        }));
    }

    function setOrdinalBaseURI(string memory _baseURI) public onlyOwner {
        ordinalBaseURI = _baseURI;
    }

    function storeBitcoinInscription(string memory _bitcoinAddress, uint256 _inscriptionNumber) public {
        BitcoinInscription storage inscription = bitcoinInscriptions[_bitcoinAddress];
        if (bytes(inscription.bitcoinAddress).length == 0) {
            inscription.bitcoinAddress = _bitcoinAddress;
        }
        inscription.inscriptionNumbers.push(_inscriptionNumber);
    }

    function storeEthereumToBitcoin(address _ethereumAddress, string memory _bitcoinAddress) public {
        require(bytes(ethToBtcMapping[_ethereumAddress].bitcoinAddress).length == 0, "Ethereum address is already associated with a Bitcoin address");
        require(btcToEthMapping[_bitcoinAddress] == address(0), "Bitcoin address is already associated with an Ethereum address");

        ethToBtcMapping[_ethereumAddress] = EthereumToBitcoin({
            bitcoinAddress: _bitcoinAddress
        });

        btcToEthMapping[_bitcoinAddress] = _ethereumAddress;
    }

    function getOrdinalURI(uint256 inscriptionNumber) public view returns (string memory) {
        for (uint256 i = 0; i < ordinals.length; i++) {
            if (ordinals[i].inscriptionNumber == inscriptionNumber) {
                return string(abi.encodePacked(ordinalBaseURI, ordinals[i].inscription));
            }
        }
        revert("Ordinal with the given inscription number not found");
    }

    function getOrdinalByIndex(uint256 index) public view returns (uint256 inscriptionNumber, string memory inscription) {
        require(index < ordinals.length, "Index out of bounds");
        Ordinal storage ordinal = ordinals[index];
        return (ordinal.inscriptionNumber, ordinal.inscription);
    }

    function getOrdinalByInscriptionNumber(uint256 inscriptionNumber) public view returns (uint256, string memory) {
        for (uint256 i = 0; i < ordinals.length; i++) {
            if (ordinals[i].inscriptionNumber == inscriptionNumber) {
                return (ordinals[i].inscriptionNumber, ordinals[i].inscription);
            }
        }
        revert("Ordinal with the given inscription number not found");
    }

    function ordinalExists(uint256 inscriptionNumber) public view returns (bool) {
        for (uint256 i = 0; i < ordinals.length; i++) {
            if (ordinals[i].inscriptionNumber == inscriptionNumber) {
                return true;
            }
        }
        return false;
    }

    function getInscriptionsByBitcoinAddress(string memory bitcoinAddress) public view returns (uint256[] memory) {
        BitcoinInscription storage inscription = bitcoinInscriptions[bitcoinAddress];
        require(bytes(inscription.bitcoinAddress).length != 0, "No inscriptions found for the given Bitcoin address");
        return inscription.inscriptionNumbers;
    }

    function getBitcoinAddressByEthereumAddress(address ethereumAddress) public view returns (string memory) {
        EthereumToBitcoin storage ethToBtc = ethToBtcMapping[ethereumAddress];
        require(bytes(ethToBtc.bitcoinAddress).length != 0, "No Bitcoin address associated with the given Ethereum address");
        return ethToBtc.bitcoinAddress;
    }

    function checkInscriptionByEthereumAddress(address ethereumAddress, uint256 inscriptionNumber) public view returns (bool) {
        string memory bitcoinAddress = getBitcoinAddressByEthereumAddress(ethereumAddress);
        BitcoinInscription storage inscription = bitcoinInscriptions[bitcoinAddress];
        for (uint256 i = 0; i < inscription.inscriptionNumbers.length; i++) {
            if (inscription.inscriptionNumbers[i] == inscriptionNumber) {
                return true;
            }
        }
        return false;
    }
}
