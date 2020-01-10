// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios'

// Actions
import {
	initialize,
	checkStatus,
	move,
	updateMap,
	updatePath,
	sellTreasure,
	confirmSale,
	manualMove
} from '../../actions';

import styled, { css } from 'styled-components';

const Cooldown = styled.h1`
	display: flex;
	justify-content: center;
	font-size: 2.4rem;
	margin-bottom: 20px;

	${props =>
		props.yellow &&
		css`
			color: #e8ce7a;
		`};
`;

const Button = styled.button`
	font-size: 1.4rem;
	background:white;
	align-items:center;
	border-radius:10px;
	margin: 30px;
`

const DirectionalButton = styled.button`
	font-size: 1.4rem;
	background:white;
	align-items:center;
	border-radius:10px;
	height: 30px
`

const WeastButton = styled.button`
	font-size: 1.4rem;
	background:white;
	align-items:center;
	border-radius:10px;
	width: 49%;
	height: 30px;
`

const ManualMovement = styled.p`
	border: 1px solid white;
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 300px;
	padding: 10px;
`
	
	const Weast = styled.div`
	display: flex;
	margin: 10px 0 10px;
	justify-content: space-between;
`

class Controls extends Component {
	state = {
		timer: null,
		cooldown: 999,
		autoDiscover: false,
	};

	tick = () => {
		this.setState({
			cooldown: this.state.cooldown - 0.1
		});

		// If cooldown has expired and we're not awaiting a response:
		if (this.state.cooldown <= 0 && !this.props.busy) {
			// If there's a path to follow:
			if (this.props.path.length) {
				// Move to the next room.
				this.move(this.props.path[0]);
			} else if (this.props.currentRoom.coordinates !== undefined) {
				if (!this.props.map[this.props.currentRoom.coordinates]) {
					this.addRoom();
				}
				if (this.state.autoDiscover) {
					// Trigger autoDiscover.
					this.autoDiscover();
				}
			}
		}
	};

	getNeighbor = (coords, direction) => {
		let [x, y] = coords.slice(1, -1).split(',');
		// Turn the strings into numbers to prevent Bad Things from happening
		x = +x;
		y = +y;

		const neighbor = {
			n: `(${x},${y + 1})`,
			s: `(${x},${y - 1})`,
			e: `(${x + 1},${y})`,
			w: `(${x - 1},${y})`
		};

		return neighbor[direction];
	};

	anticompass = direction => {
		const swap = { n: 's', s: 'n', e: 'w', w: 'e' };

		return swap[direction];
	};

	cdReset = cooldown => {
		// Update localStorage
		this.lsPath();

		// Reset the cooldown timer
		this.setState({
			cooldown: cooldown || this.props.cooldown
		});

		this.addRoom();

		// If autoDiscover is enabled:
		if (
			this.state.autoDiscover &&
			!this.props.path.length &&
			this.props.currentRoom.room_id !== undefined
		) {
			// Trigger autoDiscover.
			this.autoDiscover();
		}
	};

	move = ([direction, prediction]) => {
		this.props.move([direction, prediction], this.cdReset);
	};

	manualMove = move => {
		this.props.manualMove(move, this.cdReset)
	}

	addRoom = () => {
		const coords = this.props.currentRoom.coordinates;
		const title = this.props.currentRoom.title;

		if (!this.props.map[coords]) {
			console.log('New room discovered!');

			// Get other info.
			const exits = this.props.currentRoom.exits;
			const roomID = this.props.currentRoom.room_id;

			// Update connections to known rooms:
			const localExits = {};
			let connections = [];

			exits.forEach(exit => {
				const neighbor = this.props.map[this.getNeighbor(coords, exit)];
				console.log(
					`Neighbor ${exit} ${this.getNeighbor(coords, exit)} is ${
						neighbor ? 'known' : 'undiscovered'
					}`
				);

				// If neighbor is known:
				if (neighbor) {
					// Assign a roomID to each shared exit.
					localExits[exit] = neighbor.roomID;
					connections.push({
						coords: this.getNeighbor(coords, exit),
						exit: this.anticompass(exit),
						roomID
					});
				} else {
					localExits[exit] = '?';
				}
			});

			console.log("New room's exits:", localExits);

			// Update map boundary for visualization
			const [x, y] = coords.slice(1, -1).split(',');
			const d = this.props.map.dimensions;
			const dimensions = d
				? {
						n: y > d.n ? y : d.n,
						s: y < d.s ? y : d.s,
						e: x > d.e ? x : d.e,
						w: x < d.w ? x : d.w
				  }
				: { n: y, s: y, e: x, w: x };

			// Ship it off to the reducer.
			this.props.updateMap(
				{ coords, roomID, exits: localExits },
				connections,
				dimensions,
				title,
				this.lsMap
			);
		}
	};

	autoDiscover = () => {
		console.log('autoDiscover triggered');

		// Get coordinates.
		const coords = this.props.currentRoom.coordinates;

		let move = [];

		// Breadth first search for nearest room with unexplored exits
		let visited = new Set();
		// Just trust me on this one
		let queue = [[[null, coords]]];

		while (!move.length && queue.length && queue.length < 500) {
			console.log('Paths in queue:', queue.length);
			console.log('Rooms seen:', visited.size);

			// Dequeue a path
			let path = queue.shift();

			console.log('path', path);

			// Get the last room in the path
			const roomCoords = path[path.length - 1][1];
			const room = this.props.map[roomCoords];
			console.log('room', room);

			//
			for (let exit in room.exits) {
				const neighborCoords = this.getNeighbor(roomCoords, exit);
				// console.log('neighborCoords', neighborCoords);

				// Have we seen this room before? (during this search)
				if (!visited.has(neighborCoords)) {
					visited.add(neighborCoords);

					// Have we discovered this room?
					if (!this.props.map[neighborCoords]) {
						// Next path found. Ready to exit search.
						move = [...path.slice(1), [exit]];
					} else {
						// Add the updated path to the queue
						queue.push([...path, [exit, neighborCoords]]);
					}
				}
				// Exit search
				if (move.length) break;
			}
		}

		if (move.length) {
			console.log('Next path:', move[0]);

			this.props.updatePath(move, this.lsPath);
		} else {
			this.setState({
				autoDiscover: false,
				message: 'All rooms discovered'
			});

			console.log('autoDiscover', this.state.autoDiscover);
			console.log('All rooms discovered');
		}
	};

	// Update localStorage map
	lsMap = () => {
		localStorage.setItem('map', JSON.stringify(this.props.map));
	};

	// Update localStorage path
	lsPath = () => {
		localStorage.setItem('path', JSON.stringify(this.props.path));
	};

	componentDidMount() {
		// Get info from localStorage
		const map = JSON.parse(localStorage.getItem('map'));
		const path = JSON.parse(localStorage.getItem('path'));

		// Send map & path to the store and get current room
		this.props.initialize(map, path, this.cdReset);

		// Get status
		this.props.checkStatus();


		const timer = setInterval(this.tick, 100);

		this.setState({
			timer
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.timer);
		localStorage.setItem('cooldown', JSON.stringify(this.state.cooldown));
	}

	render() {
		return (
			<div>

				<Button onClick={() => console.log(this.props.currentRoom)} />

				<Button
					onClick={() => {
						this.setState({ autoDiscover: !this.state.autoDiscover });
						console.log('autoDiscover', !this.state.autoDiscover);
					}}
				>
					Discover Rooms
				</Button>

				<div>

					<div>
						<h1>Room Title: {this.props.currentRoom.title}</h1>
						<h1>Room Description: {this.props.currentRoom.description}</h1>
						<h1>Room ID: {this.props.currentRoom.room_id} Coordinates: {this.props.currentRoom.coordinates}</h1>
						<h1>Players in room: {this.props.currentRoom.players}</h1>
						<h1>Items in room: {this.props.currentRoom.items}</h1>
					</div>

					<ManualMovement>

						<Cooldown yellow={!this.props.busy && this.state.cooldown < 0}>
							{this.props.busy
								? 'Working...'
								: this.state.cooldown >= 0
								? `Cooldown: ${this.state.cooldown.toFixed(0)}s`
								: `Cooldown: ${-this.state.cooldown.toFixed(0)}s ago`}
						</Cooldown>

						<DirectionalButton onClick = {() => this.manualMove('n')}>N</DirectionalButton>

						<Weast>
							<WeastButton onClick = {() => this.manualMove('w')}>W</WeastButton>
							<WeastButton onClick = {() => this.manualMove('e')}>E</WeastButton>
						</Weast>

						<DirectionalButton onClick = {() => this.manualMove('s')}>S</DirectionalButton>

					</ManualMovement>

				</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	map: state.mapReducer.map,
	path: state.mapReducer.path,
	currentRoom: state.mapReducer.currentRoom,
	cooldown: state.mapReducer.cooldown,

	busy: state.mapReducer.busy
});

export default connect(
	mapStateToProps,
	{ initialize, checkStatus, move, updateMap, updatePath, sellTreasure, confirmSale, manualMove }
)(Controls);
