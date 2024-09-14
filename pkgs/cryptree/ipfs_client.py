import requests
from io import BytesIO
import socket

class IpfsClient:
    def __init__(self, ipfs_daemon_url='http://127.0.0.1:5001', token=None):
        self.ipfs_daemon_url = ipfs_daemon_url
        self.token = token

    def add_bytes(self, string_data: bytes):
        url = f'{self.ipfs_daemon_url}/api/v0/add'
        string_bytes = BytesIO(string_data)
        files = {'file': ('string_data.txt', string_bytes)}
        headers = {
            "Authorization": f'Custom {self.token}'
        }
        response = requests.post(url, files=files, headers=headers)
        if response.ok:
            ipfs_hash = response.json()['Hash']
            print(f'String uploaded to IPFS with hash: {ipfs_hash}')
            return ipfs_hash
        else:
            print('Error uploading string to IPFS')
            print(response.text)
            return None

    def cat(self, ipfs_hash):
        url = f'{self.ipfs_daemon_url}/api/v0/cat?arg={ipfs_hash}'
        headers = {
            "Authorization": f'Custom {self.token}'
        }
        response = requests.post(url, stream=True, headers=headers)
        if response.status_code == 200:
            return response.content
        else:
            raise Exception(f'Error retrieving IPFS hash {ipfs_hash} status code: {response.status_code}')
