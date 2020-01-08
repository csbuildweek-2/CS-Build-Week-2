// Dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import { Room } from '../../components';

// Actions
import { updatePath } from '../../actions';

import styled from 'styled-components';

const MapContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 700px;
	margin: 0 0 20px;
`;

const MapFrame = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	/* border: 1px solid lightgray; */
	margin: 20px 0;
`;

const MapWrapper = styled.div`
	display: flex;
	flex-direction: column;
	border: 3px solid #1a1a1a;
`;

const Row = styled.div`
	display: flex;
`;

class Map extends Component {
	state = {};

	buildMap = () => {
		const path = this.props.path.map(room => room[1]);

		// console.log('Building map...');
		const d = this.props.map.dimensions;
		let rows = [];
		for (let i = d.n; i >= d.s; i--) {
			// console.log(`Row ${i}:`);
			let row = [];
			for (let j = d.w; j <= d.e; j++) {
				// console.log(`Room (${j},${i}):`, this.props.map[`(${j},${i})`]);
				const coords = `(${j},${i})`;

				row.push(
					<Room
						key={coords}
						info={this.props.map[coords]}
						current={
							this.props.map[coords] &&
							this.props.currentRoom.room_id === this.props.map[coords].roomID
						}
						path={
							this.props.map[coords] &&
							path.includes(this.props.map[coords].roomID)
						}
						moveHere={
							this.props.map[coords] ? () => this.moveHere(coords) : null
						}
					/>
				);
			}
			rows.push(<Row key={i}>{row}</Row>);
		}
		return rows;
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

	moveHere = target => {
		let coords = this.props.currentRoom.coordinates;
		let move = [];

		// Breadth first search for shortest path to room
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

			if (!room) continue;

			//
			for (let exit in room.exits) {
				const neighborCoords = this.getNeighbor(roomCoords, exit);
				// console.log('neighborCoords', neighborCoords);

				// Have we seen this room before? (during this search)
				if (!visited.has(neighborCoords)) {
					visited.add(neighborCoords);

					// Have we discovered this room?
					if (neighborCoords === target) {
						// Next path found. Ready to exit search.
						move = [...path.slice(1), [exit, neighborCoords]];
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
			
		}
	};

	// Update localStorage path
	lsPath = () => {
		localStorage.setItem('path', JSON.stringify(this.props.path));

		
	};

	
	componentDidMount() {
		// const test = JSON.stringify({(0,1):});
		localStorage.setItem('map', JSON.stringify({dimensions: {n: "74", "s": "67", "e": "59", "w": "55"},
		"(69,60)": {"title": "A misty room", "roomID": 249, "exits": {"n": 265, "s": 240, "e": 282}},
		"(69,61)": {"title": "A misty room", "roomID": 265, "exits": {"n": 279, "s": 249, "e": 270}},
		"(69,62)": {"title": "A misty room", "roomID": 279, "exits": {"s": 265}},
		"(70,61)": {"title": "A misty room", "roomID": 270, "exits": {"n": 416, "e": 338, "w": 265}},
		"(70,62)": {"title": "A misty room", "roomID": 416, "exits": {"s": 270}},
		"(71,61)": {"title": "A misty room", "roomID": 338, "exits": {"s": 379, "w": 270}},
		"(71,60)": {"title": "A misty room", "roomID": 379, "exits": {"n": 338, "e": 395}},
		"(72,60)": {"title": "A misty room", "roomID": 395, "exits": {"s": 403, "e": 421, "w": 379}},
		"(72,59)": {"title": "A misty room", "roomID": 403, "exits": {"n": 395}},
		"(73,60)": {"title": "A misty room", "roomID": 421, "exits": {"n": 440, "w": 395}},
		"(73,61)": {"title": "A misty room", "roomID": 440, "exits": {"s": 421, "w": 476}},
		"(72,61)": {"title": "A misty room", "roomID": 476, "exits": {"e": 440}},
		"(69,59)": {"title": "A misty room", "roomID": 240, "exits": {"n": 249, "e": 386, "w": 221}},
		"(70,59)": {"title": "A misty room", "roomID": 386, "exits": {"e": 414, "w": 240}},
		"(71,59)": {"title": "A misty room", "roomID": 414, "exits": {"w": 386}},
		"(68,59)": {"title": "A misty room", "roomID": 221, "exits": {"s": 253, "e": 240, "w": 184}},
		"(68,58)": {"title": "A misty room", "roomID": 253, "exits": {"n": 221, "e": 258}},
		"(69,58)": {"title": "A misty room", "roomID": 258, "exits": {"e": 306, "w": 253}},
		"(70,58)": {"title": "A misty room", "roomID": 306, "exits": {"e": 397, "w": 258}},
		"(71,58)": {"title": "A misty room", "roomID": 397, "exits": {"w": 306}},
		"(67,59)": {"title": "A misty room", "roomID": 184, "exits": {"e": 221, "w": 127}},
		"(66,59)": {"title": "A misty room", "roomID": 127, "exits": {"e": 184, "w": 120}},
		"(65,59)": {"title": "A misty room", "roomID": 120, "exits": {"n": 107, "e": 127}},
		"(65,60)": {"title": "A misty room", "roomID": 107, "exits": {"s": 120, "e": 121, "w": 104}},
		"(66,60)": {"title": "A misty room", "roomID": 121, "exits": {"n": 128, "e": 143, "w": 107}},
		"(66,61)": {"title": "A misty room", "roomID": 128, "exits": {"s": 121, "e": 189}},
		"(67,61)": {"title": "A misty room", "roomID": 189, "exits": {"e": 255, "w": 128}},
		"(68,61)": {"title": "A misty room", "roomID": 255, "exits": {"w": 189}},
		"(67,60)": {"title": "A misty room", "roomID": 143, "exits": {"e": 212, "w": 121}},
		"(68,60)": {"title": "A misty room", "roomID": 212, "exits": {"w": 143}},
		"(64,60)": {"title": "A misty room", "roomID": 104, "exits": {"n": 59, "e": 107}},
		"(64,61)": {"title": "A misty room", "roomID": 59, "exits": {"n": 38, "s": 104, "e": 92}},
		"(64,62)": {"title": "A misty room", "roomID": 38, "exits": {"s": 59, "e": 66, "w": 33}},
		"(65,62)": {"title": "A misty room", "roomID": 66, "exits": {"n": 169, "e": 123, "w": 38}},
		"(65,63)": {"title": "A misty room", "roomID": 169, "exits": {"s": 66, "e": 186}},
		"(66,63)": {"title": "A misty room", "roomID": 186, "exits": {"e": 205, "w": 169}},
		"(67,63)": {"title": "A misty room", "roomID": 205, "exits": {"s": 241, "e": 479, "w": 186}},
		"(67,62)": {"title": "A misty room", "roomID": 241, "exits": {"n": 205, "e": 266}},
		"(68,62)": {"title": "A misty room", "roomID": 266, "exits": {"w": 241}},
		"(68,63)": {"title": "A misty room", "roomID": 479, "exits": {"w": 205}},
		"(66,62)": {"title": "A misty room", "roomID": 123, "exits": {"w": 66}},
		"(63,62)": {"title": "A misty room", "roomID": 33, "exits": {"e": 38, "w": 31}},
		"(62,62)": {"title": "A misty room", "roomID": 31, "exits": {"n": 30, "e": 33}},
		"(62,63)": {"title": "A misty room", "roomID": 30, "exits": {"s": 31, "e": 32, "w": 27}},
		"(63,63)": {"title": "A misty room", "roomID": 32, "exits": {"n": 39, "e": 54, "w": 30}},
		"(63,64)": {"title": "A misty room", "roomID": 39, "exits": {"n": 53, "s": 32, "e": 51, "w": 41}},
		"(63,65)": {"title": "A misty room", "roomID": 53, "exits": {"n": 95, "s": 39, "w": 88}},
		"(63,66)": {"title": "A misty room", "roomID": 95, "exits": {"n": 119, "s": 53, "w": 115}},
		"(63,67)": {"title": "A misty room", "roomID": 119, "exits": {"n": 134, "s": 95}},
		"(63,68)": {"title": "A misty room", "roomID": 134, "exits": {"n": 147, "s": 119, "e": 144}},
		"(63,69)": {"title": "A misty room", "roomID": 147, "exits": {"n": 200, "s": 134, "e": 153, "w": 151}},
		"(63,70)": {"title": "A misty room", "roomID": 200, "exits": {"n": 227, "s": 147, "e": 206}},
		"(63,71)": {"title": "A misty room", "roomID": 227, "exits": {"n": 269, "s": 200}},
		"(63,72)": {"title": "A misty room", "roomID": 269, "exits": {"n": 319, "s": 227}},
		"(63,73)": {"title": "A misty room", "roomID": 319, "exits": {"n": 359, "s": 269, "e": 345}},
		"(63,74)": {"title": "A misty room", "roomID": 359, "exits": {"s": 319}},
		"(64,73)": {"title": "A misty room", "roomID": 345, "exits": {"s": 375, "w": 319}},
		"(64,72)": {"title": "A misty room", "roomID": 375, "exits": {"n": 345, "e": 385}},
		"(65,72)": {"title": "A misty room", "roomID": 385, "exits": {"w": 375}},
		"(64,70)": {"title": "A misty room", "roomID": 206, "exits": {"n": 288, "e": 380, "w": 200}},
		"(64,71)": {"title": "A misty room", "roomID": 288, "exits": {"s": 206}},
		"(65,70)": {"title": "A misty room", "roomID": 380, "exits": {"n": 424, "w": 206}},
		"(65,71)": {"title": "A misty room", "roomID": 424, "exits": {"s": 380, "e": 473}},
		"(66,71)": {"title": "A misty room", "roomID": 473, "exits": {"e": 494, "w": 424}},
		"(67,71)": {"title": "A misty room", "roomID": 494, "exits": {"w": 473}},
		"(64,69)": {"title": "A misty room", "roomID": 153, "exits": {"e": 329, "w": 147}},
		"(65,69)": {"title": "A misty room", "roomID": 329, "exits": {"w": 153}},
		"(62,69)": {"title": "A misty room", "roomID": 151, "exits": {"n": 172, "e": 147, "w": 207}},
		"(62,70)": {"title": "A misty room", "roomID": 172, "exits": {"n": 267, "s": 151}},
		"(62,71)": {"title": "A misty room", "roomID": 267, "exits": {"n": 285, "s": 172, "w": 271}},
		"(62,72)": {"title": "A misty room", "roomID": 285, "exits": {"n": 286, "s": 267}},
		"(62,73)": {"title": "A misty room", "roomID": 286, "exits": {"n": 336, "s": 285, "w": 291}},
		"(62,74)": {"title": "A misty room", "roomID": 336, "exits": {"s": 286}},
		"(61,73)": {"title": "A misty room", "roomID": 291, "exits": {"n": 410, "e": 286, "w": 347}},
		"(61,74)": {"title": "A misty room", "roomID": 410, "exits": {"s": 291}},
		"(60,73)": {"title": "A misty room", "roomID": 347, "exits": {"n": 452, "s": 442, "e": 291}},
		"(60,74)": {"title": "A misty room", "roomID": 452, "exits": {"s": 347}},
		"(60,72)": {"title": "A misty room", "roomID": 442, "exits": {"n": 347}},
		"(61,71)": {"title": "A misty room", "roomID": 271, "exits": {"n": 337, "e": 267}},
		"(61,72)": {"title": "A misty room", "roomID": 337, "exits": {"s": 271}},
		"(61,69)": {"title": "A misty room", "roomID": 207, "exits": {"n": 231, "e": 151, "w": 290}},
		"(61,70)": {"title": "A misty room", "roomID": 231, "exits": {"s": 207, "w": 248}},
		"(60,70)": {"title": "A misty room", "roomID": 248, "exits": {"n": 296, "e": 231, "w": 280}},
		"(60,71)": {"title": "A misty room", "roomID": 296, "exits": {"s": 248}},
		"(59,70)": {"title": "A misty room", "roomID": 280, "exits": {"n": 325, "e": 248}},
		"(59,71)": {"title": "A misty room", "roomID": 325, "exits": {"n": 353, "s": 280, "w": 374}},
		"(59,72)": {"title": "A misty room", "roomID": 353, "exits": {"s": 325}},
		"(58,71)": {"title": "Fully Shrine", "roomID": 374, "exits": {"e": 325}},
		"(60,69)": {"title": "A misty room", "roomID": 290, "exits": {"e": 207}},
		"(64,68)": {"title": "A misty room", "roomID": 144, "exits": {"e": 155, "w": 134}},
		"(65,68)": {"title": "A misty room", "roomID": 155, "exits": {"s": 187, "e": 316, "w": 144}},
		"(65,67)": {"title": "A misty room", "roomID": 187, "exits": {"n": 155}},
		"(66,68)": {"title": "A misty room", "roomID": 316, "exits": {"n": 344, "w": 155}},
		"(66,69)": {"title": "A misty room", "roomID": 344, "exits": {"n": 392, "s": 316, "e": 390}},
		"(66,70)": {"title": "A misty room", "roomID": 392, "exits": {"s": 344, "e": 462}},
		"(67,70)": {"title": "A misty room", "roomID": 462, "exits": {"w": 392}},
		"(67,69)": {"title": "A misty room", "roomID": 390, "exits": {"w": 344}},
		"(62,66)": {"title": "A misty room", "roomID": 115, "exits": {"n": 116, "e": 95}},
		"(62,67)": {"title": "A misty room", "roomID": 116, "exits": {"n": 132, "s": 115}},
		"(62,68)": {"title": "A misty room", "roomID": 132, "exits": {"s": 116}},
		"(62,65)": {"title": "A misty room", "roomID": 88, "exits": {"e": 53, "w": 122}},
		"(61,65)": {"title": "A misty room", "roomID": 122, "exits": {"n": 124, "e": 88}},
		"(61,66)": {"title": "A misty room", "roomID": 124, "exits": {"n": 157, "s": 122}},
		"(61,67)": {"title": "A misty room", "roomID": 157, "exits": {"n": 210, "s": 124, "w": 182}},
		"(61,68)": {"title": "A misty room", "roomID": 210, "exits": {"s": 157}},
		"(60,67)": {"title": "A misty room", "roomID": 182, "exits": {"e": 157, "w": 208}},
		"(59,67)": {"title": "A misty room", "roomID": 208, "exits": {"e": 182}},
		"(64,64)": {"title": "A misty room", "roomID": 51, "exits": {"n": 69, "e": 57, "w": 39}},
		"(64,65)": {"title": "A misty room", "roomID": 69, "exits": {"n": 94, "s": 51, "e": 103}},
		"(64,66)": {"title": "A misty room", "roomID": 94, "exits": {"n": 152, "s": 69}},
		"(64,67)": {"title": "A misty room", "roomID": 152, "exits": {"s": 94}},
		"(65,65)": {"title": "A misty room", "roomID": 103, "exits": {"n": 160, "w": 69}},
		"(65,66)": {"title": "A misty room", "roomID": 160, "exits": {"s": 103}},
		"(65,64)": {"title": "A misty room", "roomID": 57, "exits": {"e": 145, "w": 51}},
		"(66,64)": {"title": "A misty room", "roomID": 145, "exits": {"n": 174, "e": 220, "w": 57}},
		"(66,65)": {"title": "A misty room", "roomID": 174, "exits": {"n": 192, "s": 145, "e": 224}},
		"(66,66)": {"title": "A misty room", "roomID": 192, "exits": {"n": 201, "s": 174, "e": 223}},
		"(66,67)": {"title": "A misty room", "roomID": 201, "exits": {"s": 192}},
		"(67,66)": {"title": "A misty room", "roomID": 223, "exits": {"n": 283, "w": 192}},
		"(67,67)": {"title": "A misty room", "roomID": 283, "exits": {"n": 331, "s": 223, "e": 313}},
		"(67,68)": {"title": "A misty room", "roomID": 331, "exits": {"s": 283, "e": 446}},
		"(68,68)": {"title": "A misty room", "roomID": 446, "exits": {"e": 466, "w": 331}},
		"(69,68)": {"title": "A misty room", "roomID": 466, "exits": {"s": 486, "e": 472, "w": 446}},
		"(69,67)": {"title": "Arron's Athenaeum", "roomID": 486, "exits": {"n": 466}},
		"(70,68)": {"title": "A misty room", "roomID": 472, "exits": {"w": 466}},
		"(68,67)": {"title": "A misty room", "roomID": 313, "exits": {"w": 283}},
		"(67,65)": {"title": "A misty room", "roomID": 224, "exits": {"w": 174}},
		"(67,64)": {"title": "A misty room", "roomID": 220, "exits": {"w": 145}},
		"(62,64)": {"title": "A misty room", "roomID": 41, "exits": {"e": 39}},
		"(64,63)": {"title": "A misty room", "roomID": 54, "exits": {"w": 32}},
		"(61,63)": {"title": "A misty room", "roomID": 27, "exits": {"n": 40, "s": 28, "e": 30, "w": 20}},
		"(61,64)": {"title": "A misty room", "roomID": 40, "exits": {"s": 27}},
		"(61,62)": {"title": "A misty room", "roomID": 28, "exits": {"n": 27}},
		"(60,63)": {"title": "A misty room", "roomID": 20, "exits": {"n": 63, "s": 19, "e": 27, "w": 46}},
		"(60,64)": {"title": "A misty room", "roomID": 63, "exits": {"n": 72, "s": 20, "w": 73}},
		"(60,65)": {"title": "A misty room", "roomID": 72, "exits": {"s": 63, "w": 76}},
		"(59,65)": {"title": "A misty room", "roomID": 76, "exits": {"n": 83, "e": 72, "w": 110}},
		"(59,66)": {"title": "A misty room", "roomID": 83, "exits": {"s": 76, "e": 130, "w": 125}},
		"(60,66)": {"title": "A misty room", "roomID": 130, "exits": {"w": 83}},
		"(58,66)": {"title": "A misty room", "roomID": 125, "exits": {"n": 165, "e": 83, "w": 237}},
		"(58,67)": {"title": "A misty room", "roomID": 165, "exits": {"n": 203, "s": 125, "w": 204}},
		"(58,68)": {"title": "A misty room", "roomID": 203, "exits": {"n": 268, "s": 165, "e": 299}},
		"(58,69)": {"title": "A misty room", "roomID": 268, "exits": {"s": 203, "e": 411, "w": 312}},
		"(59,69)": {"title": "A misty room", "roomID": 411, "exits": {"w": 268}},
		"(57,69)": {"title": "A misty room", "roomID": 312, "exits": {"n": 328, "e": 268}},
		"(57,70)": {"title": "A misty room", "roomID": 328, "exits": {"n": 332, "s": 312, "e": 357, "w": 363}},
		"(57,71)": {"title": "A misty room", "roomID": 332, "exits": {"n": 350, "s": 328}},
		"(57,72)": {"title": "A misty room", "roomID": 350, "exits": {"n": 436, "s": 332, "e": 404}},
		"(57,73)": {"title": "A misty room", "roomID": 436, "exits": {"s": 350}},
		"(58,72)": {"title": "A misty room", "roomID": 404, "exits": {"n": 481, "w": 350}},
		"(58,73)": {"title": "A misty room", "roomID": 481, "exits": {"s": 404}},
		"(58,70)": {"title": "A misty room", "roomID": 357, "exits": {"w": 328}},
		"(56,70)": {"title": "A misty room", "roomID": 363, "exits": {"n": 372, "e": 328}},
		"(56,71)": {"title": "A misty room", "roomID": 372, "exits": {"n": 441, "s": 363}},
		"(56,72)": {"title": "A misty room", "roomID": 441, "exits": {"s": 372}},
		"(59,68)": {"title": "A misty room", "roomID": 299, "exits": {"e": 311, "w": 203}},
		"(60,68)": {"title": "A misty room", "roomID": 311, "exits": {"w": 299}},
		"(57,67)": {"title": "A misty room", "roomID": 204, "exits": {"n": 219, "e": 165, "w": 216}},
		"(57,68)": {"title": "A misty room", "roomID": 219, "exits": {"s": 204}},
		"(56,67)": {"title": "A Dark Cave", "roomID": 216, "exits": {"n": 234, "e": 204, "w": 218}},
		"(56,68)": {"title": "A Dark Cave", "roomID": 234, "exits": {"n": 368, "s": 216, "w": 252}},
		"(56,69)": {"title": "A Dark Cave", "roomID": 368, "exits": {"s": 234}},
		"(55,68)": {"title": "A Dark Cave", "roomID": 252, "exits": {"n": 284, "e": 234}},
		"(55,69)": {"title": "A Dark Cave", "roomID": 284, "exits": {"n": 302, "s": 252, "w": 303}},
		"(55,70)": {"title": "A Dark Cave", "roomID": 302, "exits": {"n": 422, "s": 284}},
		"(55,71)": {"title": "A Dark Cave", "roomID": 422, "exits": {"n": 426, "s": 302}},
		"(55,72)": {"title": "A Dark Cave", "roomID": 426, "exits": {"n": 457, "s": 422}},
		"(55,73)": {"title": "A Dark Cave", "roomID": 457, "exits": {"n": 461, "s": 426}},
		"(55,74)": {"title": "Linh's Shrine", "roomID": 461, "exits": {"s": 457}},
		"(54,69)": {"title": "A Dark Cave", "roomID": 303, "exits": {"n": 361, "e": 284, "w": 405}},
		"(54,70)": {"title": "A Dark Cave", "roomID": 361, "exits": {"n": 408, "s": 303}},
		"(54,71)": {"title": "A Dark Cave", "roomID": 408, "exits": {"n": 458, "s": 361, "w": 423}},
		"(54,72)": {"title": "A Dark Cave", "roomID": 458, "exits": {"s": 408, "w": 459}},
		"(53,72)": {"title": "A Dark Cave", "roomID": 459, "exits": {"e": 458}},
		"(53,71)": {"title": "A Dark Cave", "roomID": 423, "exits": {"e": 408, "w": 454}},
		"(52,71)": {"title": "A Dark Cave", "roomID": 454, "exits": {"n": 470, "e": 423}},
		"(52,72)": {"title": "A Dark Cave", "roomID": 470, "exits": {"s": 454}},
		"(53,69)": {"title": "A Dark Cave", "roomID": 405, "exits": {"n": 406, "e": 303}},
		"(53,70)": {"title": "A Dark Cave", "roomID": 406, "exits": {"s": 405, "w": 415}},
		"(52,70)": {"title": "A Dark Cave", "roomID": 415, "exits": {"e": 406, "w": 418}},
		"(51,70)": {"title": "A Dark Cave", "roomID": 418, "exits": {"n": 425, "s": 474, "e": 415}},
		"(51,71)": {"title": "A Dark Cave", "roomID": 425, "exits": {"s": 418, "w": 469}},
		"(50,71)": {"title": "A Dark Cave", "roomID": 469, "exits": {"e": 425}},
		"(51,69)": {"title": "A Dark Cave", "roomID": 474, "exits": {"n": 418}},
		"(55,67)": {"title": "A Dark Cave", "roomID": 218, "exits": {"s": 263, "e": 216, "w": 242}},
		"(55,66)": {"title": "A Dark Cave", "roomID": 263, "exits": {"n": 218}},
		"(54,67)": {"title": "A Dark Cave", "roomID": 242, "exits": {"n": 287, "s": 259, "e": 218, "w": 275}},
		"(54,68)": {"title": "A Dark Cave", "roomID": 287, "exits": {"s": 242, "w": 339}},
		"(53,68)": {"title": "A Dark Cave", "roomID": 339, "exits": {"e": 287, "w": 445}},
		"(52,68)": {"title": "A Dark Cave", "roomID": 445, "exits": {"n": 447, "e": 339, "w": 450}},
		"(52,69)": {"title": "A Dark Cave", "roomID": 447, "exits": {"s": 445}},
		"(51,68)": {"title": "A Dark Cave", "roomID": 450, "exits": {"e": 445}},
		"(54,66)": {"title": "A Dark Cave", "roomID": 259, "exits": {"n": 242, "w": 310}},
		"(53,66)": {"title": "A Dark Cave", "roomID": 310, "exits": {"e": 259, "w": 412}},
		"(52,66)": {"title": "A Dark Cave", "roomID": 412, "exits": {"s": 488, "e": 310}},
		"(52,65)": {"title": "A Dark Cave", "roomID": 488, "exits": {"n": 412}},
		"(53,67)": {"title": "A misty room", "roomID": 275, "exits": {"e": 242, "w": 456}},
		"(52,67)": {"title": "A misty room", "roomID": 456, "exits": {"e": 275, "w": 499}},
		"(51,67)": {"title": "Glasowyn's Grave", "roomID": 499, "exits": {"e": 456}},
		"(57,66)": {"title": "A misty room", "roomID": 237, "exits": {"e": 125, "w": 245}},
		"(56,66)": {"title": "A misty room", "roomID": 245, "exits": {"s": 254, "e": 237}},
		"(56,65)": {"title": "A misty room", "roomID": 254, "exits": {"n": 245, "w": 314}},
		"(55,65)": {"title": "A misty room", "roomID": 314, "exits": {"e": 254}},
		"(58,65)": {"title": "A misty room", "roomID": 110, "exits": {"e": 76}},
		"(59,64)": {"title": "A misty room", "roomID": 73, "exits": {"e": 63}},
		"(60,62)": {"title": "A misty room", "roomID": 19, "exits": {"n": 20, "s": 10, "w": 77}},
		"(60,61)": {"title": "A misty room", "roomID": 10, "exits": {"n": 19, "s": 0, "w": 43}},
		"(60,60)": {"title": "A brightly lit room", "roomID": 0, "exits": {"n": 10, "s": 2, "e": 4, "w": 1}},
		"(60,59)": {"title": "A misty room", "roomID": 2, "exits": {"n": 0, "s": 6, "e": 3}},
		"(60,58)": {"title": "A misty room", "roomID": 6, "exits": {"n": 2, "w": 7}},
		"(59,58)": {"title": "A misty room", "roomID": 7, "exits": {"n": 8, "e": 6, "w": 56}},
		"(59,59)": {"title": "A misty room", "roomID": 8, "exits": {"s": 7, "w": 16}},
		"(58,59)": {"title": "A misty room", "roomID": 16, "exits": {"n": 58, "e": 8, "w": 67}},
		"(58,60)": {"title": "A misty room", "roomID": 58, "exits": {"s": 16, "w": 65}},
		"(57,60)": {"title": "A misty room", "roomID": 65, "exits": {"n": 74, "e": 58, "w": 139}},
		"(57,61)": {"title": "A misty room", "roomID": 74, "exits": {"n": 87, "s": 65, "w": 161}},
		"(57,62)": {"title": "A misty room", "roomID": 87, "exits": {"s": 74}},
		"(56,61)": {"title": "A misty room", "roomID": 161, "exits": {"e": 74}},
		"(56,60)": {"title": "A misty room", "roomID": 139, "exits": {"e": 65, "w": 188}},
		"(55,60)": {"title": "A misty room", "roomID": 188, "exits": {"e": 139, "w": 335}},
		"(54,60)": {"title": "A misty room", "roomID": 335, "exits": {"e": 188, "w": 366}},
		"(53,60)": {"title": "A misty room", "roomID": 366, "exits": {"e": 335}},
		"(57,59)": {"title": "A misty room", "roomID": 67, "exits": {"e": 16, "w": 162}},
		"(56,59)": {"title": "A misty room", "roomID": 162, "exits": {"e": 67}},
		"(58,58)": {"title": "A misty room", "roomID": 56, "exits": {"e": 7, "w": 61}},
		"(57,58)": {"title": "A misty room", "roomID": 61, "exits": {"e": 56, "w": 171}},
		"(56,58)": {"title": "A misty room", "roomID": 171, "exits": {"e": 61}},
		"(61,59)": {"title": "Mt. Holloway", "roomID": 3, "exits": {"s": 9, "e": 5, "w": 2}},
		"(61,58)": {"title": "Mt. Holloway", "roomID": 9, "exits": {"n": 3, "s": 12, "e": 11}},
		"(61,57)": {"title": "Mt. Holloway", "roomID": 12, "exits": {"n": 9, "s": 18, "e": 14, "w": 21}},
		"(61,56)": {"title": "Mt. Holloway", "roomID": 18, "exits": {"n": 12, "s": 22, "w": 25}},
		"(61,55)": {"title": "The Peak of Mt. Holloway", "roomID": 22, "exits": {"n": 18, "s": 78, "w": 36}},
		"(61,54)": {"title": "Mt. Holloway", "roomID": 78, "exits": {"n": 22, "s": 108}},
		"(61,53)": {"title": "Mt. Holloway", "roomID": 108, "exits": {"n": 78, "s": 117, "e": 93}},
		"(61,52)": {"title": "Mt. Holloway", "roomID": 117, "exits": {"n": 108, "s": 131, "e": 166, "w": 133}},
		"(61,51)": {"title": "Mt. Holloway", "roomID": 131, "exits": {"n": 117, "s": 244, "w": 138}},
		"(61,50)": {"title": "A misty room", "roomID": 244, "exits": {"n": 131, "e": 239}},
		"(62,50)": {"title": "A misty room", "roomID": 239, "exits": {"n": 198, "w": 244}},
		"(62,51)": {"title": "A misty room", "roomID": 198, "exits": {"n": 166, "s": 239, "e": 199}},
		"(62,52)": {"title": "Mt. Holloway", "roomID": 166, "exits": {"s": 198, "e": 150, "w": 117}},
		"(63,52)": {"title": "A misty room", "roomID": 150, "exits": {"n": 135, "w": 166}},
		"(63,53)": {"title": "A misty room", "roomID": 135, "exits": {"s": 150, "e": 106}},
		"(64,53)": {"title": "A misty room", "roomID": 106, "exits": {"n": 100, "s": 111, "w": 135}},
		"(64,54)": {"title": "A misty room", "roomID": 100, "exits": {"s": 106, "e": 112, "w": 68}},
		"(65,54)": {"title": "A misty room", "roomID": 112, "exits": {"s": 141, "e": 140, "w": 100}},
		"(65,53)": {"title": "A misty room", "roomID": 141, "exits": {"n": 112, "e": 156}},
		"(66,53)": {"title": "A misty room", "roomID": 156, "exits": {"s": 168, "e": 164, "w": 141}},
		"(66,52)": {"title": "A misty room", "roomID": 168, "exits": {"n": 156, "e": 340}},
		"(67,52)": {"title": "A misty room", "roomID": 340, "exits": {"w": 168}},
		"(67,53)": {"title": "A misty room", "roomID": 164, "exits": {"n": 217, "e": 298, "w": 156}},
		"(67,54)": {"title": "A misty room", "roomID": 217, "exits": {"s": 164, "e": 247}},
		"(68,54)": {"title": "A misty room", "roomID": 247, "exits": {"e": 261, "w": 217}},
		"(69,54)": {"title": "A misty room", "roomID": 261, "exits": {"s": 277, "e": 322, "w": 247}},
		"(69,53)": {"title": "A misty room", "roomID": 277, "exits": {"n": 261, "e": 323}},
		"(70,53)": {"title": "A misty room", "roomID": 323, "exits": {"e": 433, "w": 277}},
		"(71,53)": {"title": "A misty room", "roomID": 433, "exits": {"s": 455, "e": 460, "w": 323}},
		"(71,52)": {"title": "A misty room", "roomID": 455, "exits": {"n": 433}},
		"(72,53)": {"title": "A misty room", "roomID": 460, "exits": {"w": 433}},
		"(70,54)": {"title": "A misty room", "roomID": 322, "exits": {"n": 382, "e": 435, "w": 261}},
		"(70,55)": {"title": "A misty room", "roomID": 382, "exits": {"s": 322, "e": 388}},
		"(71,55)": {"title": "A misty room", "roomID": 388, "exits": {"e": 477, "w": 382}},
		"(72,55)": {"title": "A misty room", "roomID": 477, "exits": {"e": 483, "w": 388}},
		"(73,55)": {"title": "A misty room", "roomID": 483, "exits": {"w": 477}},
		"(71,54)": {"title": "A misty room", "roomID": 435, "exits": {"w": 322}},
		"(68,53)": {"title": "A misty room", "roomID": 298, "exits": {"s": 324, "w": 164}},
		"(68,52)": {"title": "A misty room", "roomID": 324, "exits": {"n": 298, "s": 349, "e": 354}},
		"(68,51)": {"title": "A misty room", "roomID": 349, "exits": {"n": 324, "s": 352, "e": 384, "w": 356}},
		"(68,50)": {"title": "A misty room", "roomID": 352, "exits": {"n": 349, "s": 362, "e": 485}},
		"(68,49)": {"title": "A misty room", "roomID": 362, "exits": {"n": 352, "s": 399, "w": 463}},
		"(68,48)": {"title": "A misty room", "roomID": 399, "exits": {"n": 362, "s": 467}},
		"(68,47)": {"title": "Pirate Ry's", "roomID": 467, "exits": {"n": 399}},
		"(67,49)": {"title": "A misty room", "roomID": 463, "exits": {"s": 468, "e": 362}},
		"(67,48)": {"title": "A misty room", "roomID": 468, "exits": {"n": 463}},
		"(69,50)": {"title": "A misty room", "roomID": 485, "exits": {"w": 352}},
		"(69,51)": {"title": "A misty room", "roomID": 384, "exits": {"w": 349}},
		"(67,51)": {"title": "A misty room", "roomID": 356, "exits": {"e": 349}},
		"(69,52)": {"title": "A misty room", "roomID": 354, "exits": {"w": 324}},
		"(66,54)": {"title": "A misty room", "roomID": 140, "exits": {"w": 112}},
		"(63,54)": {"title": "A misty room", "roomID": 68, "exits": {"n": 52, "e": 100}},
		"(63,55)": {"title": "A misty room", "roomID": 52, "exits": {"n": 35, "s": 68, "e": 75}},
		"(63,56)": {"title": "A misty room", "roomID": 35, "exits": {"s": 52, "w": 34}},
		"(62,56)": {"title": "Mt. Holloway", "roomID": 34, "exits": {"n": 14, "s": 50, "e": 35}},
		"(62,57)": {"title": "Mt. Holloway", "roomID": 14, "exits": {"s": 34, "e": 37, "w": 12}},
		"(63,57)": {"title": "Mt. Holloway", "roomID": 37, "exits": {"w": 14}},
		"(62,55)": {"title": "A misty room", "roomID": 50, "exits": {"n": 34, "s": 89}},
		"(62,54)": {"title": "Mt. Holloway", "roomID": 89, "exits": {"n": 50, "s": 93}},
		"(62,53)": {"title": "Mt. Holloway", "roomID": 93, "exits": {"n": 89, "w": 108}},
		"(60,52)": {"title": "Mt. Holloway", "roomID": 133, "exits": {"e": 117, "w": 173}},
		"(59,52)": {"title": "A misty room", "roomID": 173, "exits": {"e": 133, "w": 214}},
		"(58,52)": {"title": "A misty room", "roomID": 214, "exits": {"n": 194, "e": 173, "w": 226}},
		"(58,53)": {"title": "A misty room", "roomID": 194, "exits": {"s": 214, "w": 129}},
		"(57,53)": {"title": "A misty room", "roomID": 129, "exits": {"n": 126, "e": 194, "w": 170}},
		"(57,54)": {"title": "A misty room", "roomID": 126, "exits": {"n": 98, "s": 129}},
		"(57,55)": {"title": "Mt. Holloway", "roomID": 98, "exits": {"n": 102, "s": 126, "e": 70, "w": 109}},
		"(57,56)": {"title": "A misty room", "roomID": 102, "exits": {"s": 98, "w": 142}},
		"(56,56)": {"title": "A misty room", "roomID": 142, "exits": {"e": 102, "w": 159}},
		"(55,56)": {"title": "A misty room", "roomID": 159, "exits": {"e": 142, "w": 196}},
		"(54,56)": {"title": "A misty room", "roomID": 196, "exits": {"n": 222, "e": 159, "w": 197}},
		"(54,57)": {"title": "A misty room", "roomID": 222, "exits": {"n": 305, "s": 196}},
		"(54,58)": {"title": "A misty room", "roomID": 305, "exits": {"n": 365, "s": 222}},
		"(54,59)": {"title": "A misty room", "roomID": 365, "exits": {"s": 305}},
		"(53,56)": {"title": "A misty room", "roomID": 197, "exits": {"n": 232, "e": 196, "w": 276}},
		"(53,57)": {"title": "A misty room", "roomID": 232, "exits": {"n": 272, "s": 197, "w": 235}},
		"(53,58)": {"title": "A misty room", "roomID": 272, "exits": {"n": 295, "s": 232}},
		"(53,59)": {"title": "A misty room", "roomID": 295, "exits": {"s": 272}},
		"(52,57)": {"title": "A misty room", "roomID": 235, "exits": {"n": 330, "e": 232, "w": 355}},
		"(52,58)": {"title": "A misty room", "roomID": 330, "exits": {"n": 369, "s": 235, "w": 383}},
		"(52,59)": {"title": "A misty room", "roomID": 369, "exits": {"n": 400, "s": 330, "w": 376}},
		"(52,60)": {"title": "A misty room", "roomID": 400, "exits": {"s": 369}},
		"(51,59)": {"title": "A misty room", "roomID": 376, "exits": {"e": 369}},
		"(51,58)": {"title": "A misty room", "roomID": 383, "exits": {"e": 330, "w": 495}},
		"(50,58)": {"title": "The Transmogriphier", "roomID": 495, "exits": {"e": 383}},
		"(51,57)": {"title": "A misty room", "roomID": 355, "exits": {"e": 235}},
		"(52,56)": {"title": "A misty room", "roomID": 276, "exits": {"e": 197, "w": 419}},
		"(51,56)": {"title": "A misty room", "roomID": 419, "exits": {"e": 276}},
		"(58,55)": {"title": "Mt. Holloway", "roomID": 70, "exits": {"s": 163, "e": 60, "w": 98}},
		"(58,54)": {"title": "Mt. Holloway", "roomID": 163, "exits": {"n": 70}},
		"(59,55)": {"title": "Mt. Holloway", "roomID": 60, "exits": {"n": 45, "e": 36, "w": 70}},
		"(59,56)": {"title": "Mt. Holloway", "roomID": 45, "exits": {"n": 29, "s": 60}},
		"(59,57)": {"title": "Mt. Holloway", "roomID": 29, "exits": {"s": 45, "e": 21, "w": 49}},
		"(60,57)": {"title": "Mt. Holloway", "roomID": 21, "exits": {"e": 12, "w": 29}},
		"(58,57)": {"title": "A misty room", "roomID": 49, "exits": {"s": 79, "e": 29, "w": 136}},
		"(58,56)": {"title": "A misty room", "roomID": 79, "exits": {"n": 49}},
		"(57,57)": {"title": "A misty room", "roomID": 136, "exits": {"e": 49, "w": 148}},
		"(56,57)": {"title": "A misty room", "roomID": 148, "exits": {"e": 136, "w": 292}},
		"(55,57)": {"title": "A misty room", "roomID": 292, "exits": {"n": 301, "e": 148}},
		"(55,58)": {"title": "A misty room", "roomID": 301, "exits": {"n": 304, "s": 292}},
		"(55,59)": {"title": "A misty room", "roomID": 304, "exits": {"s": 301}},
		"(60,55)": {"title": "Mt. Holloway", "roomID": 36, "exits": {"s": 48, "e": 22, "w": 60}},
		"(60,54)": {"title": "Mt. Holloway", "roomID": 48, "exits": {"n": 36, "s": 105, "w": 149}},
		"(60,53)": {"title": "Mt. Holloway", "roomID": 105, "exits": {"n": 48, "w": 202}},
		"(59,53)": {"title": "Mt. Holloway", "roomID": 202, "exits": {"e": 105}},
		"(59,54)": {"title": "Mt. Holloway", "roomID": 149, "exits": {"e": 48}},
		"(60,56)": {"title": "Mt. Holloway", "roomID": 25, "exits": {"e": 18}},
		"(62,58)": {"title": "Mt. Holloway", "roomID": 11, "exits": {"e": 17, "w": 9}},
		"(63,58)": {"title": "A misty room", "roomID": 17, "exits": {"n": 24, "e": 42, "w": 11}},
		"(63,59)": {"title": "A misty room", "roomID": 24, "exits": {"s": 17}},
		"(64,58)": {"title": "A misty room", "roomID": 42, "exits": {"n": 44, "s": 80, "e": 118, "w": 17}},
		"(64,59)": {"title": "A misty room", "roomID": 44, "exits": {"s": 42}},
		"(64,57)": {"title": "A misty room", "roomID": 80, "exits": {"n": 42, "s": 81, "e": 86}},
		"(64,56)": {"title": "A misty room", "roomID": 81, "exits": {"n": 80}},
		"(65,57)": {"title": "A misty room", "roomID": 86, "exits": {"s": 96, "e": 90, "w": 80}},
		"(65,56)": {"title": "A misty room", "roomID": 96, "exits": {"n": 86, "e": 97}},
		"(66,56)": {"title": "A misty room", "roomID": 97, "exits": {"e": 181, "w": 96}},
		"(67,56)": {"title": "A misty room", "roomID": 181, "exits": {"w": 97}},
		"(66,57)": {"title": "A misty room", "roomID": 90, "exits": {"e": 178, "w": 86}},
		"(67,57)": {"title": "A misty room", "roomID": 178, "exits": {"n": 209, "e": 243, "w": 90}},
		"(67,58)": {"title": "A misty room", "roomID": 209, "exits": {"s": 178}},
		"(68,57)": {"title": "A misty room", "roomID": 243, "exits": {"s": 293, "e": 256, "w": 178}},
		"(68,56)": {"title": "A misty room", "roomID": 293, "exits": {"n": 243}},
		"(69,57)": {"title": "A misty room", "roomID": 256, "exits": {"s": 360, "e": 327, "w": 243}},
		"(69,56)": {"title": "A misty room", "roomID": 360, "exits": {"n": 256, "e": 398}},
		"(70,56)": {"title": "A misty room", "roomID": 398, "exits": {"e": 438, "w": 360}},
		"(71,56)": {"title": "A misty room", "roomID": 438, "exits": {"e": 465, "w": 398}},
		"(72,56)": {"title": "A misty room", "roomID": 465, "exits": {"e": 498, "w": 438}},
		"(73,56)": {"title": "A misty room", "roomID": 498, "exits": {"w": 465}},
		"(70,57)": {"title": "A misty room", "roomID": 327, "exits": {"e": 427, "w": 256}},
		"(71,57)": {"title": "A misty room", "roomID": 427, "exits": {"e": 430, "w": 327}},
		"(72,57)": {"title": "A misty room", "roomID": 430, "exits": {"n": 443, "e": 439, "w": 427}},
		"(72,58)": {"title": "A misty room", "roomID": 443, "exits": {"s": 430, "e": 471}},
		"(73,58)": {"title": "A misty room", "roomID": 471, "exits": {"w": 443}},
		"(73,57)": {"title": "A misty room", "roomID": 439, "exits": {"w": 430}},
		"(65,58)": {"title": "A misty room", "roomID": 118, "exits": {"e": 137, "w": 42}},
		"(66,58)": {"title": "A misty room", "roomID": 137, "exits": {"w": 118}},
		"(62,59)": {"title": "A misty room", "roomID": 5, "exits": {"w": 3}},
		"(61,60)": {"title": "A misty room", "roomID": 4, "exits": {"n": 23, "e": 13, "w": 0}},
		"(61,61)": {"title": "A misty room", "roomID": 23, "exits": {"s": 4, "e": 26}},
		"(62,61)": {"title": "A misty room", "roomID": 26, "exits": {"e": 55, "w": 23}},
		"(63,61)": {"title": "Wishing Well", "roomID": 55, "exits": {"w": 26}},
		"(62,60)": {"title": "A misty room", "roomID": 13, "exits": {"e": 15, "w": 4}},
		"(63,60)": {"title": "A misty room", "roomID": 15, "exits": {"w": 13}},
		"(59,60)": {"title": "Shop", "roomID": 1, "exits": {"e": 0}},
		"(59,61)": {"title": "A misty room", "roomID": 43, "exits": {"e": 10, "w": 47}},
		"(58,61)": {"title": "A misty room", "roomID": 47, "exits": {"n": 71, "e": 43}},
		"(58,62)": {"title": "A misty room", "roomID": 71, "exits": {"s": 47}},
		"(59,62)": {"title": "A misty room", "roomID": 77, "exits": {"e": 19}},
		"(59,63)": {"title": "A misty room", "roomID": 46, "exits": {"e": 20, "w": 62}},
		"(58,63)": {"title": "A misty room", "roomID": 62, "exits": {"n": 64, "e": 46, "w": 84}},
		"(58,64)": {"title": "A misty room", "roomID": 64, "exits": {"s": 62, "w": 82}},
		"(57,64)": {"title": "A misty room", "roomID": 82, "exits": {"n": 191, "e": 64}},
		"(57,65)": {"title": "A misty room", "roomID": 191, "exits": {"s": 82}},
		"(57,63)": {"title": "A misty room", "roomID": 84, "exits": {"e": 62, "w": 91}},
		"(56,63)": {"title": "A misty room", "roomID": 91, "exits": {"n": 180, "s": 101, "e": 84, "w": 99}},
		"(56,64)": {"title": "A misty room", "roomID": 180, "exits": {"s": 91}},
		"(56,62)": {"title": "A misty room", "roomID": 101, "exits": {"n": 91, "w": 113}},
		"(55,62)": {"title": "A misty room", "roomID": 113, "exits": {"s": 114, "e": 101}},
		"(55,61)": {"title": "A misty room", "roomID": 114, "exits": {"n": 113, "w": 176}},
		"(54,61)": {"title": "A misty room", "roomID": 176, "exits": {"e": 114, "w": 402}},
		"(53,61)": {"title": "A misty room", "roomID": 402, "exits": {"e": 176, "w": 451}},
		"(52,61)": {"title": "A misty room", "roomID": 451, "exits": {"e": 402, "w": 453}},
		"(51,61)": {"title": "A misty room", "roomID": 453, "exits": {"s": 464, "e": 451}},
		"(51,60)": {"title": "A misty room", "roomID": 464, "exits": {"n": 453}},
		"(55,63)": {"title": "A misty room", "roomID": 99, "exits": {"n": 190, "e": 91, "w": 146}},
		"(55,64)": {"title": "A misty room", "roomID": 190, "exits": {"s": 99}},
		"(54,63)": {"title": "A misty room", "roomID": 146, "exits": {"n": 215, "s": 177, "e": 99, "w": 257}},
		"(54,64)": {"title": "A misty room", "roomID": 215, "exits": {"n": 246, "s": 146}},
		"(54,65)": {"title": "A misty room", "roomID": 246, "exits": {"s": 215}},
		"(54,62)": {"title": "A misty room", "roomID": 177, "exits": {"n": 146, "w": 346}},
		"(53,62)": {"title": "A misty room", "roomID": 346, "exits": {"e": 177}},
		"(53,63)": {"title": "A misty room", "roomID": 257, "exits": {"n": 320, "e": 146, "w": 364}},
		"(53,64)": {"title": "A misty room", "roomID": 320, "exits": {"n": 348, "s": 257}},
		"(53,65)": {"title": "A misty room", "roomID": 348, "exits": {"s": 320}},
		"(52,63)": {"title": "A misty room", "roomID": 364, "exits": {"n": 429, "s": 381, "e": 257, "w": 448}},
		"(52,64)": {"title": "A misty room", "roomID": 429, "exits": {"s": 364}},
		"(52,62)": {"title": "A misty room", "roomID": 381, "exits": {"n": 364, "w": 394}},
		"(51,62)": {"title": "A misty room", "roomID": 394, "exits": {"e": 381}},
		"(51,63)": {"title": "A misty room", "roomID": 448, "exits": {"e": 364}},
		"(65,61)": {"title": "A misty room", "roomID": 92, "exits": {"w": 59}},
		"(70,60)": {"title": "A misty room", "roomID": 282, "exits": {"w": 249}},
		"(64,55)": {"title": "A misty room", "roomID": 75, "exits": {"e": 85, "w": 52}},
		"(65,55)": {"title": "A misty room", "roomID": 85, "exits": {"e": 154, "w": 75}},
		"(66,55)": {"title": "A misty room", "roomID": 154, "exits": {"e": 193, "w": 85}},
		"(67,55)": {"title": "A misty room", "roomID": 193, "exits": {"e": 251, "w": 154}},
		"(68,55)": {"title": "A misty room", "roomID": 251, "exits": {"e": 315, "w": 193}},
		"(69,55)": {"title": "A misty room", "roomID": 315, "exits": {"w": 251}},
		"(64,52)": {"title": "A misty room", "roomID": 111, "exits": {"n": 106, "s": 367, "e": 158}},
		"(64,51)": {"title": "A misty room", "roomID": 367, "exits": {"n": 111}},
		"(65,52)": {"title": "A misty room", "roomID": 158, "exits": {"s": 167, "w": 111}},
		"(65,51)": {"title": "A misty room", "roomID": 167, "exits": {"n": 158, "s": 262, "e": 260}},
		"(65,50)": {"title": "A misty room", "roomID": 262, "exits": {"n": 167, "s": 370, "e": 358}},
		"(65,49)": {"title": "A misty room", "roomID": 370, "exits": {"n": 262, "s": 434, "e": 407}},
		"(65,48)": {"title": "A misty room", "roomID": 434, "exits": {"n": 370}},
		"(66,49)": {"title": "A misty room", "roomID": 407, "exits": {"s": 496, "w": 370}},
		"(66,48)": {"title": "A misty room", "roomID": 496, "exits": {"n": 407}},
		"(66,50)": {"title": "A misty room", "roomID": 358, "exits": {"e": 401, "w": 262}},
		"(67,50)": {"title": "A misty room", "roomID": 401, "exits": {"w": 358}},
		"(66,51)": {"title": "A misty room", "roomID": 260, "exits": {"w": 167}},
		"(63,51)": {"title": "A misty room", "roomID": 199, "exits": {"s": 230, "w": 198}},
		"(63,50)": {"title": "A misty room", "roomID": 230, "exits": {"n": 199, "s": 307, "e": 297}},
		"(63,49)": {"title": "A misty room", "roomID": 307, "exits": {"n": 230, "s": 373, "e": 371, "w": 321}},
		"(63,48)": {"title": "A misty room", "roomID": 373, "exits": {"n": 307, "s": 480}},
		"(63,47)": {"title": "A misty room", "roomID": 480, "exits": {"n": 373}},
		"(64,49)": {"title": "A misty room", "roomID": 371, "exits": {"s": 475, "w": 307}},
		"(64,48)": {"title": "A misty room", "roomID": 475, "exits": {"n": 371, "s": 484}},
		"(64,47)": {"title": "A misty room", "roomID": 484, "exits": {"n": 475}},
		"(62,49)": {"title": "A misty room", "roomID": 321, "exits": {"s": 413, "e": 307}},
		"(62,48)": {"title": "A misty room", "roomID": 413, "exits": {"n": 321}},
		"(64,50)": {"title": "A misty room", "roomID": 297, "exits": {"w": 230}},
		"(60,51)": {"title": "A misty room", "roomID": 138, "exits": {"s": 211, "e": 131, "w": 195}},
		"(60,50)": {"title": "A misty room", "roomID": 211, "exits": {"n": 138}},
		"(59,51)": {"title": "A misty room", "roomID": 195, "exits": {"s": 228, "e": 138, "w": 225}},
		"(59,50)": {"title": "A misty room", "roomID": 228, "exits": {"n": 195, "s": 281}},
		"(59,49)": {"title": "A misty room", "roomID": 281, "exits": {"n": 228, "s": 318, "e": 309, "w": 317}},
		"(59,48)": {"title": "A misty room", "roomID": 318, "exits": {"n": 281, "s": 487}},
		"(59,47)": {"title": "A misty room", "roomID": 487, "exits": {"n": 318, "s": 489}},
		"(59,46)": {"title": "A misty room", "roomID": 489, "exits": {"n": 487}},
		"(60,49)": {"title": "A misty room", "roomID": 309, "exits": {"s": 333, "e": 326, "w": 281}},
		"(60,48)": {"title": "A misty room", "roomID": 333, "exits": {"n": 309, "s": 378}},
		"(60,47)": {"title": "A misty room", "roomID": 378, "exits": {"n": 333}},
		"(61,49)": {"title": "A misty room", "roomID": 326, "exits": {"s": 342, "w": 309}},
		"(61,48)": {"title": "A misty room", "roomID": 342, "exits": {"n": 326, "s": 432}},
		"(61,47)": {"title": "A misty room", "roomID": 432, "exits": {"n": 342}},
		"(58,49)": {"title": "A misty room", "roomID": 317, "exits": {"s": 387, "e": 281, "w": 409}},
		"(58,48)": {"title": "A misty room", "roomID": 387, "exits": {"n": 317, "s": 417, "w": 431}},
		"(58,47)": {"title": "A misty room", "roomID": 417, "exits": {"n": 387}},
		"(57,48)": {"title": "A misty room", "roomID": 431, "exits": {"e": 387, "w": 492}},
		"(56,48)": {"title": "A misty room", "roomID": 492, "exits": {"e": 431}},
		"(57,49)": {"title": "A misty room", "roomID": 409, "exits": {"e": 317}},
		"(58,51)": {"title": "A misty room", "roomID": 225, "exits": {"s": 278, "e": 195}},
		"(58,50)": {"title": "A misty room", "roomID": 278, "exits": {"n": 225}},
		"(57,52)": {"title": "A misty room", "roomID": 226, "exits": {"s": 300, "e": 214}},
		"(57,51)": {"title": "A misty room", "roomID": 300, "exits": {"n": 226, "s": 377, "w": 389}},
		"(57,50)": {"title": "A misty room", "roomID": 377, "exits": {"n": 300}},
		"(56,51)": {"title": "A misty room", "roomID": 389, "exits": {"e": 300}},
		"(56,53)": {"title": "A misty room", "roomID": 170, "exits": {"e": 129}},
		"(56,55)": {"title": "A misty room", "roomID": 109, "exits": {"s": 185, "e": 98, "w": 175}},
		"(56,54)": {"title": "A misty room", "roomID": 185, "exits": {"n": 109}},
		"(55,55)": {"title": "A misty room", "roomID": 175, "exits": {"s": 183, "e": 109, "w": 179}},
		"(55,54)": {"title": "A misty room", "roomID": 183, "exits": {"n": 175, "s": 229}},
		"(55,53)": {"title": "A misty room", "roomID": 229, "exits": {"n": 183, "s": 250, "w": 236}},
		"(55,52)": {"title": "A misty room", "roomID": 250, "exits": {"n": 229, "s": 294, "e": 289}},
		"(55,51)": {"title": "A misty room", "roomID": 294, "exits": {"n": 250, "s": 334}},
		"(55,50)": {"title": "A misty room", "roomID": 334, "exits": {"n": 294, "s": 393, "e": 341, "w": 391}},
		"(55,49)": {"title": "A misty room", "roomID": 393, "exits": {"n": 334, "s": 482}},
		"(55,48)": {"title": "A misty room", "roomID": 482, "exits": {"n": 393}},
		"(56,50)": {"title": "A misty room", "roomID": 341, "exits": {"s": 449, "w": 334}},
		"(56,49)": {"title": "A misty room", "roomID": 449, "exits": {"n": 341}},
		"(54,50)": {"title": "A misty room", "roomID": 391, "exits": {"s": 396, "e": 334, "w": 428}},
		"(54,49)": {"title": "A misty room", "roomID": 396, "exits": {"n": 391}},
		"(53,50)": {"title": "A misty room", "roomID": 428, "exits": {"e": 391}},
		"(56,52)": {"title": "A misty room", "roomID": 289, "exits": {"w": 250}},
		"(54,53)": {"title": "A misty room", "roomID": 236, "exits": {"s": 264, "e": 229}},
		"(54,52)": {"title": "A misty room", "roomID": 264, "exits": {"n": 236, "s": 274, "w": 273}},
		"(54,51)": {"title": "A misty room", "roomID": 274, "exits": {"n": 264, "w": 308}},
		"(53,51)": {"title": "A misty room", "roomID": 308, "exits": {"e": 274}},
		"(53,52)": {"title": "A misty room", "roomID": 273, "exits": {"n": 343, "e": 264}},
		"(53,53)": {"title": "A misty room", "roomID": 343, "exits": {"s": 273, "w": 351}},
		"(52,53)": {"title": "A misty room", "roomID": 351, "exits": {"s": 491, "e": 343, "w": 478}},
		"(52,52)": {"title": "A misty room", "roomID": 491, "exits": {"n": 351}},
		"(51,53)": {"title": "A misty room", "roomID": 478, "exits": {"e": 351}},
		"(54,55)": {"title": "A misty room", "roomID": 179, "exits": {"s": 233, "e": 175, "w": 213}},
		"(54,54)": {"title": "A misty room", "roomID": 233, "exits": {"n": 179, "w": 238}},
		"(53,54)": {"title": "A misty room", "roomID": 238, "exits": {"e": 233}},
		"(53,55)": {"title": "A misty room", "roomID": 213, "exits": {"e": 179, "w": 420}},
		"(52,55)": {"title": "A misty room", "roomID": 420, "exits": {"s": 444, "e": 213, "w": 437}},
		"(52,54)": {"title": "A misty room", "roomID": 444, "exits": {"n": 420, "w": 490}},
		"(51,54)": {"title": "A misty room", "roomID": 490, "exits": {"e": 444, "w": 493}},
		"(50,54)": {"title": "A misty room", "roomID": 493, "exits": {"e": 490}},
		"(51,55)": {"title": "A misty room", "roomID": 437, "exits": {"e": 420, "w": 497}},
		"(50,55)": {"title": "A misty room", "roomID": 497, "exits": {"e": 437}}}))
		const map = JSON.parse(localStorage.getItem('map'));
		this.setState({ map});
		

		
	}

	
	
		
	
	
	render() {
		// if (this.props.title === 'Shop') {
		// 	localStorage.setItem('shop', this.props.currentRoom.coordinates)
		// }
		// if (this.props.title === 'A Dark Cave') {
		// 	localStorage.setItem('Dark Cave', this.props.currentRoom.coordinates)
		// }
		
		
		
		return (
			
			<MapContainer>
			
			 
				<MapFrame>
					{!this.props.map.dimensions ? (
						'Welcome, adventurer.'
					) : (
						<MapWrapper>{this.buildMap()}</MapWrapper>
					)}
				</MapFrame>

				{'Current Room: ' +
					(this.props.currentRoom.room_id
						? `${this.props.currentRoom.room_id} ${
								this.props.currentRoom.coordinates
						  }`
						: '?')}
				<br />
				{'Rooms discovered: ' + Object.keys(this.props.map).length}
				<br />
				{'Path: ' + JSON.stringify(this.props.path)}
				<br />
				{`Current Cooldown: ${this.props.cooldown}s`}

				{/* <p>{`Current Room: ${JSON.stringify(this.props.currentRoom)}`}</p> */}
			</MapContainer>
		);
	}
}

const mapStateToProps = state => ({
	map: state.mapReducer.map,
	path: state.mapReducer.path,
	currentRoom: state.mapReducer.currentRoom,
	title: state.mapReducer.title,
	cooldown: state.mapReducer.cooldown,

	busy: state.mapReducer.busy
});

export default connect(
	mapStateToProps,
	{ updatePath }
)(Map);
