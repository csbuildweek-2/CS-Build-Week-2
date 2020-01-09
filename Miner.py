import hashlib
import requests

import sys
import json

from uuid import uuid4

from timeit import default_timer as timer
import time

import random


def proof_of_work(last_proof):
    """
    Multi-Ouroboros of Work Algorithm
    - Find a number p' such that the last six digits of hash(p) are equal
    to the first six digits of hash(p')
    - IE:  last_hash: ...AE9123456, new hash 123456888...
    - p is the previous proof, and p' is the new proof
    - Use the same method to generate SHA-256 hashes as the examples in class
    """

    start = timer()

    print("Searching for next proof")
    last_hash = json.dumps(last_proof, sort_keys=True).encode()
    last_hash = hashlib.sha256(last_hash).hexdigest()
    proof = 42
    #  TODO: Your code here
    while valid_proof(last_hash, proof) is False:
        proof += 7

    print("Proof found: " + str(proof) + " in " + str(timer() - start))
    return proof


def valid_proof(last_hash, proof):
    """
    Validates the Proof:  Multi-ouroborus:  Do the last six characters of
    the hash of the last proof match the first six characters of the hash
    of the new proof?

    IE:  last_hash: ...AE9123456, new hash 123456E88...
    """

    # TODO: Your code here!
    guess = f'{proof}'.encode()
    guess_hash = hashlib.sha256(guess).hexdigest()
    # print(type(guess_hash[0]), 'type')
    if guess_hash[:6] == '0' * 6:
        print(guess_hash, last_hash, 'hashes')
        return guess_hash
    else:
        return False


if __name__ == '__main__':
    # What node are we interacting with?
    if len(sys.argv) > 1:
        node = sys.argv[1]
    else:
        node = "https://lambda-treasure-hunt.herokuapp.com/api/bc/"

    coins_mined = 0

    # Load or create ID
    # f = open("my_id.txt", "r")
    # id = f.read()
    # print("ID is", id)
    # f.close()

    # if id == 'NONAME\n':
    #     print("ERROR: You must change your name in `my_id.txt`!")
    #     exit()
    # Run forever until interrupted

    headers = {'Authorization': 'Token 9886d9de14212034c6646d9ea18c7975ce07bede'}

    while True:
        # Get the last proof from the server
        time.sleep(1)
        r = requests.get(url=node + "/last_proof", headers=headers)
        print('get', r.json())
        data = r.json()
        new_proof = proof_of_work(data.get('proof'))

        post_data = {"proof": new_proof}

        r = requests.post(url=node + "/mine", headers=headers, data=post_data)
        print('post', r.json())
        data = r.json()
        if data.get('message') == 'New Block Forged':
            coins_mined += 1
            print("Total coins mined: " + str(coins_mined))
        else:
            print(data.get('message'))
