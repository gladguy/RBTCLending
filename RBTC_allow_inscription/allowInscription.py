from web3 import Web3
import sys
import warnings
import json
import os

with warnings.catch_warnings():
    warnings.simplefilter("ignore", DeprecationWarning)
    # Code that causes DeprecationWarning

result = ""
def append_to_file(data, filename='python_rootstock.txt'):
    """
    Appends the given data to the specified file.

    Parameters:
    data (str): The data to be appended to the file.
    filename (str): The name of the file to which the data will be appended. Defaults to 'output.txt'.
    """

    with open(filename, 'a') as file:
        file.write(data + '\n')  # Add a newline for better readability in the file

# Connect to an RootStock node, replace the URL with your node address
node_url = "https://rpc.testnet.rootstock.io/KNA5rVQdS51lbC6izhT1w1ZCqnzWrG-T"
web3 = Web3(Web3.HTTPProvider(node_url))

# Check connection
if not web3.is_connected():
    append_to_file("Failed to connect to the RootStock node.")
else:
    append_to_file("Connected to the RootStock node.")

# Set up the contract
contract_address = "0xa9EE082Ca9C5C1AA6C1Fd17A677E992681420daB"
contract_abi = '[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MAX_ORDINALS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MintIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"addAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"inscriptionNumber","type":"uint256"}],"name":"allowInscriptionNumber","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipMintState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isMinted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxOrdinals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_inscriptionNumber","type":"uint256"}],"name":"mintOrdinal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"admin","type":"address"}],"name":"removeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
#contract_abi = '[{"inputs":[],"name":"deleteNumber","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_Number","type":"uint256"}],"name":"saveNumber","outputs":[],"stateMutability":"nonpayable","type":"function"}]'

checksum_address = web3.to_checksum_address(contract_address)

append_to_file(checksum_address)
contract = web3.eth.contract(address=checksum_address, abi=contract_abi)

# Reading data from the contract
def read_data():
    # Example: Call a function that retrieves data from the contract
    data = contract.functions.symbol().call()
    append_to_file("Data from contract:", data)

# Sending a transaction to the contract
def send_transaction():
    # Setup transaction details
    account = "0x4F14309C857AA274F2E6d7cB86b89F1FBdd21223"
    private_key = "c848a9bfbd9e5b4020d36b180e4a544b41bd48ddbfc47752092aa57db65ff37b"

    # Nonce for transaction
    nonce = web3.eth.get_transaction_count(account)

    # Transaction details
    txn = contract.functions.totalSupply().build_transaction({
        'chainId': 31,
        'gas': 2000000,
        'gasPrice': web3.to_wei('10', 'gwei'),
        'nonce': nonce,
    })

    # Sign the transaction
    signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)

    # Send the transaction
    txn_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    append_to_file("Transaction sent, hash:" + txn_hash.hex())


    # Wait for transaction receipt
    receipt = web3.eth.waitForTransactionReceipt(txn_hash)
    append_to_file("Transaction receipt:" + receipt)





# Function to call allowInscriptionNumber
def call_allow_inscription_number(to_address, inscription_number):
    # Your account details
    account = "0x6470c4d86b062fF4e1030D5615c4B04cD78bF9Cf"
    private_key = "9882cf29be44a5dd7d9956bdbd3f35a5dbfda176f555559677daca0e6b5877dd"


    transaction = contract.functions.allowInscriptionNumber(
        web3.to_checksum_address(to_address),
        inscription_number
    )

    function_call = contract.functions.allowInscriptionNumber(web3.to_checksum_address(to_address), inscription_number)

    # Estimate gas for the transaction
    estimated_gas = function_call.estimate_gas({
        'from': web3.to_checksum_address(account)
    })

    current_gas_price = web3.eth.gas_price
    append_to_file(f"Current network gas price: {current_gas_price}")


    # Build the transaction with the estimated gas
    transaction = function_call.build_transaction({
        'chainId': 31,
        'gas': estimated_gas + 10000,  # Adding a small buffer to the estimated gas
        'gasPrice': current_gas_price,
        'nonce': web3.eth.get_transaction_count(account),
    })

    # Sign the transaction
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key)

    # Send the transaction
    txn_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    append_to_file("Transaction sent. Hash:" + txn_hash.hex())


    # Wait for transaction receipt
    receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
    append_to_file("Transaction confirmed. Block Number:" + str(receipt.blockNumber))


    data = {
        "inscriptionNumber": str(number),
        "Transaction Hash": txn_hash.hex(),
        "Block Number": str(receipt.blockNumber)
    }
    return data

# Example usage
if __name__ == "__main__":
    if len(sys.argv) < 3:
        append_to_file("Usage: python3 allow_inscription.py <RootStock_address> <number>")
    else:
        ethereum_address = sys.argv[1]
        number = int(sys.argv[2])
        data = call_allow_inscription_number(ethereum_address, number)
        # Convert the dictionary to a JSON formatted string
        json_string = json.dumps(data, indent=4)
        print(json_string)
