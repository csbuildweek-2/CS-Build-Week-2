# import requests

# headers = {
#     'Authorization': 'Token  19fede1bf2deb46c45107d9fd1abf4052f0eec92',
# }

# response = requests.get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', headers=headers)
# print(response)
import json
from flask import Flask, jsonify, request
app=Flask(__name__)
from flask_cors import CORS,cross_origin
CORS(app, support_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', methods=['GET'])
@cross_origin(supports_credentials=True)
def full_chain():
    
    data = request.get_json()
    
    return jsonify(response), 200
@app.route('/', methods=['GET'])
def home():
    return "<h1>Welcome to blockchain!</h1>", 200
# Run the program on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)