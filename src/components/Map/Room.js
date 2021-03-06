// Dependencies
import React from 'react';

import styled from 'styled-components';

const RoomContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 34px;
	height: 34px;
	cursor: ${props => (props.explored ? 'pointer' : 'default')};
	background: ${props =>
		props.current
			? '#b52f2f'
			: props.path
			? '#b5a93f'
			: props.explored
			? 'blue'
			: '#1a1a1a'};
	font-size: 2.1rem;
	font-weight: bold;

	border-top: ${props =>
		props.explored && props.explored.n !== undefined
			? props.explored.n === '?'
				? '3px solid darkred'
				: '3px solid #6b6b6b'
			: '3px solid #1a1a1a'};

	border-bottom: ${props =>
		props.explored && props.explored.s !== undefined
			? props.explored.s === '?'
				? '3px solid red'
				: '3px solid #6b6b6b'
			: '3px solid #1a1a1a'};

	border-right: ${props =>
		props.explored && props.explored.e !== undefined
			? props.explored.e === '?'
				? '3px solid red'
				: '3px solid #6b6b6b'
			: '3px solid #1a1a1a'};

	border-left: ${props =>
		props.explored && props.explored.w !== undefined
			? props.explored.w === '?'
				? '3px solid red'
				: '3px solid #6b6b6b'
			: '3px solid #1a1a1a'};

	border-radius: 5px;
`;

const Room = props => {
	return (
		<RoomContainer
			current={props.current}
			explored={props.info && props.info.exits}
			path={props.path}
			onClick={props.moveHere}
		>
			{props.info && `${props.info.roomID}`}
		</RoomContainer>
	);
};

export default Room;
