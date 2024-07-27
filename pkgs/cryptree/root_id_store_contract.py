import requests
from web3 import Web3, HTTPProvider
import os
from dotenv import load_dotenv
import json
from web3.middleware import geth_poa_middleware

class RootIdStoreContract:
    # クラス変数の初期化
    load_dotenv()
    infura_project_id = os.getenv('INFURA_PROJECT_ID')
    infura_base_url = os.getenv('INFURA_BASE_URL')
    private_key = os.getenv('PRIVATE_KEY')
    root_id_store_contract_address = os.getenv('ROOT_ID_STORE_CONTRACT_ADDRESS')
    chain_id = os.getenv('CHAIN_ID')

    if not (infura_project_id and infura_base_url and private_key and root_id_store_contract_address):
        raise ValueError("Environment variables not properly configured.")
    
    infura_url = f"{infura_base_url}/{infura_project_id}"
    web3 = Web3(HTTPProvider(infura_url))
    web3.middleware_onion.inject(geth_poa_middleware, layer=0)
    admin_account = web3.eth.account.from_key(private_key).address
    
    @classmethod
    def get_contract(cls):
        contract_address = Web3.to_checksum_address(cls.root_id_store_contract_address)
        with open('root_id_store_contract_abi.json', 'r') as f:
            contract_abi = json.load(f)
        return cls.web3.eth.contract(address=contract_address, abi=contract_abi)

    
    @classmethod
    def update_root_id(cls, address: str, new_cid: str):
        contract = cls.get_contract()
        nonce = cls.web3.eth.get_transaction_count(cls.admin_account)
        function = contract.functions.updateRootId(Web3.to_checksum_address(address), new_cid)
        transaction = cls.build_transaction(function, nonce)
        return cls.send_transaction(transaction)

    @classmethod
    def get_root_id(cls, address: str):
        contract = cls.get_contract()
        try:
            root_id = contract.functions.getRootId(Web3.to_checksum_address(address)).call()
            return root_id
        except Exception as e:
            raise ValueError("No rows found for the given address.") from e

    @classmethod
    def build_transaction(cls, function, nonce):
        transaction = function.build_transaction({
            'from': cls.admin_account,
            'chainId': int(cls.chain_id),
            'nonce': nonce,
        })
        return transaction

    @classmethod
    def send_transaction(cls, transaction):
        signed_txn = cls.web3.eth.account.sign_transaction(transaction, cls.private_key)
        txn_hash = cls.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        txn_receipt = cls.web3.eth.wait_for_transaction_receipt(txn_hash)
        return txn_receipt, txn_hash.hex()

