from room import Room
from player import Player
from world import World

import random
import json
import random
import sys
sys.path.append('../graph')
from graph import Graph
from util import Queue, Stack
sys.setrecursionlimit(5000)
# Load world
world = World()

world.loadGraph(roomGraph)

# UNCOMMENT TO VIEW MAP
world.printRooms()

player = Player("Name", world.startingRoom)

# Fill this out
traversalPath = []
current = player.currentRoom.id
reversePath = []
visited_rooms = set()
player.currentRoom = world.startingRoom
visited_rooms.add(player.currentRoom.id)
fastPath = []


#building traversal graph and replacing directions with '?'s
'''
Copying graph and switching all directions to '?'
This is to check if room has any unvisited directions
'''
traversalGraph = {}
for i in range(len(roomGraph)):
    copy = roomGraph[i][1].copy()
    if 'n' in copy:
        copy['n'] = '?'
    if 's' in copy:
        copy['s'] = '?'
    if 'e' in copy:
        copy['e'] = '?'
    if 'w' in copy:
        copy['w'] = '?'
    traversalGraph[i] = copy

# print(f'ROOM GRAPH {roomGraph}')
# print(f'TRAVERSAL GRAPH {traversalGraph}')
''''
Swapping key <-> values in graph to create a new graph for constant lookup
i.e {'n': 1} gets changed to {1 : 'n}
This is for getting the directions from the path returned from bfs when searhing for a room with a '?'

'''
goBack = {}
for i in range(len(roomGraph)):
    copy = roomGraph[i][1].copy()
    goBack[i] = {value:key for key, value in copy.items()}
 
# print(f'goBack GRAPH {goBack}')



# Create an empty queue and enqueue the starting vertex ID
stack = Stack()
stack.push(player.currentRoom.id)


#Start with depth first search
def dft(current=player.currentRoom.id):

    #must convert graph to string to check if '?' is in it
    string = json.dumps(traversalGraph[current])
    while '?' in string: #while a room has destinations that haven't been visited
        direction = [] 
        # get all directions and append them to array
        for d in traversalGraph[current]:
            if traversalGraph[current][d] == '?':
                direction.append(d)
            
            
            
        #pick a random unsearched room
        move = random.choice(direction)
       
       # move in specifed directions chosen from random and added it to traversalPath
        if move == 'n':
            traversalGraph[current]['n'] = roomGraph[current][1]['n']
            player.travel('n')
            traversalPath.append(move)
            current = player.currentRoom.id
            traversalGraph[current]['s'] = roomGraph[current][1]['s']
            string = json.dumps(traversalGraph[current])
        elif move == 's':
            traversalGraph[current]['s'] = roomGraph[current][1]['s']
            player.travel('s')
            traversalPath.append(move)
            current = player.currentRoom.id
            traversalGraph[current]['n'] = roomGraph[current][1]['n']
            string = json.dumps(traversalGraph[current])
        elif move == 'e':
            traversalGraph[current]['e'] = roomGraph[current][1]['e']
            player.travel('e')
            traversalPath.append(move)
            current = player.currentRoom.id
            traversalGraph[current]['w'] = roomGraph[current][1]['w']
            string = json.dumps(traversalGraph[current])
        elif move == 'w':
            traversalGraph[current]['w'] = roomGraph[current][1]['w']
            player.travel('w')
            traversalPath.append(move)
            current = player.currentRoom.id
            traversalGraph[current]['e'] = roomGraph[current][1]['e']
            string = json.dumps(traversalGraph[current])

    # when reaching a dead end and a room with no '?', do a bfs to find nearest room with a '?'
    return bfs(current)

def bfs(current=player.currentRoom.id):

    queue = Queue()
    queue.enqueue([current])
    # Create a Set to store visited vertices
    visited = set()

    while queue.size() > 0:
        # print('hello')
        path = queue.dequeue()
        v = path[-1]

        #convert to string to check for ?
        string = json.dumps(traversalGraph[v])

        if v not in visited:
            if '?' in string:

                for d in range(len(path) - 1): # set to -1 for off by one error
                    rewind = goBack[path[d]][path[d+1]] #this will grab the direction from the goBack graph 
                    player.travel(rewind) #travel in that direction
                    traversalPath.append(rewind) #append it to path
                    current = player.currentRoom.id 

                return dft(current) #go back to dft
            visited.add(v)
            for neighbor in roomGraph[v][1]:
                    # copy path and append it to bak
       
                    path_copy = path.copy()
                    path_copy.append(roomGraph[v][1][neighbor])
                    queue.enqueue(path_copy)
    
            


    # print(traversalGraph)
   
        



dft(player.currentRoom.id)
# TRAVERSAL TEST
visited_rooms = set()
player.currentRoom = world.startingRoom
visited_rooms.add(player.currentRoom)

for move in traversalPath:
    player.travel(move)
    visited_rooms.add(player.currentRoom)

if len(visited_rooms) == len(roomGraph):
    print(f"TESTS PASSED: {len(traversalPath)} moves, {len(visited_rooms)} rooms visited")
else:
    print("TESTS FAILED: INCOMPLETE TRAVERSAL")
    print(f"{len(roomGraph) - len(visited_rooms)} unvisited rooms")


