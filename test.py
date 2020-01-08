headers = {
    'Authorization': '19fede1bf2deb46c45107d9fd1abf4052f0eec92',
    'Content-Type': 'application/json'
}
class Player:
    
    def __init__(self, name, startingRoom):
        self.name = name
        self.currentRoom = startingRoom
    def travel(self, direction):
        print("Direction:", direction)
        if direction == "n":
            data={"direction": "n"}
        if direction == "s":
            data={"direction": "s"}
        if direction == "e":
            data={"direction": "e"}
        if direction == "w":
            data={"direction": "w"}
        res=requests.post(
            'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', headers=headers, data=json.dumps(data)
        )
        nextRoom=json.loads(res.text)
        self.currentRoom=nextRoompython
        print(nextRoom, "Here is our new room")
    def init(self):
        res=requests.get(
            'https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', headers=headers 
        )
        nextRoom=json.loads(res.text)
        self.currentRoom=nextRoom
    def pilfer(self):
        if len(self.currentRoom['items']) > 0:
            data={"name": "treasure"}
            res=requests.post(
            'https://lambda-treasure-hunt.herokuapp.com/api/adv/take/', headers=headers, data=json.dumps(data)
            )
    def drop(self):
        data={"name": "treasure"}
        res=requests.post(
        'https://lambda-treasure-hunt.herokuapp.com/api/adv/drop/', headers=headers, data=json.dumps(data)
        )
        print("-------", res.text, "DROPPING TREASURE")
    def status(self):
        res=requests.post(
            'https://lambda-treasure-hunt.herokuapp.com/api/adv/status/', headers=headers
            )
        print("-------------------------------STATUS-------------------------------------", json.loads(res.text))
    def sell(self):
        data1={"name": "treasure"}
        res=requests.post(
        'https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/', headers=headers, data=json.dumps(data1)
        )
        print("-------", res.text, "SELLING MY TREASURE")
        time.sleep(5)
        data2={"name": "treasure", "confirm": "yes"}
        res=requests.post(
        'https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/', headers=headers, data=json.dumps(data2)
        )

traversalPath = []
#-----------
copy={} 
rooms=[]
reverse=[]
#-----------
while len(copy) < 500:
  print("----------------------COPY------------------------------------", copy)
  print("----------------------ROOMS------------------------------------", rooms)
  print("----------------------Current room in while loop----------------", player.currentRoom)
  curCooldown=player.currentRoom['cooldown']
  time.sleep(curCooldown)
  if len(player.currentRoom['items']) > 0:
    player.pilfer()
    time.sleep(8)
  time.sleep(2)
  player.status()
  time.sleep(2)
  roomObj=player.currentRoom
  curRoom=player.currentRoom['room_id']