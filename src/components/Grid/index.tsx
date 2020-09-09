import * as React from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import GridItem from '../GridItem';

const Root = styled.div`
	height: 100%;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Board = styled.div`
	display: grid;
	border: 10px solid black;
	background-color: black;
	width: 600px;
	height: 600px;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: repeat(5, 1fr);
	grid-gap: 10px;
`;

export enum COLORS {
	RED = 'red',
	ORANGE = 'orange',
	WHITE = 'white',
	GREEN = 'green',
	BLUE = 'blue',
	YELLOW = 'yellow',
}

const colors = [
	COLORS.RED,
	COLORS.ORANGE,
	COLORS.WHITE,
	COLORS.GREEN,
	COLORS.BLUE,
	COLORS.YELLOW,
];
const fullColourList = colors.reduce((acc: COLORS[], curr: COLORS) => {
	return [...acc, curr, curr, curr, curr];
}, []);

const Preview = styled.div`
	display: grid;
	width: 300px;
	height: 300px;
	background-color: black;
	border: 15px solid black;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	grid-gap: 15px;
`;

export type BoardArray = (null | COLORS)[];

const PreviewItem = styled.div<{ color: COLORS }>`
	background-color: ${({ color }) => color};
`;

function swapArrayItem(input: any[], a: number, b: number): any[] {
	const clonedInput = [...input];
	let temp = clonedInput[a];

	clonedInput[a] = clonedInput[b];
	clonedInput[b] = temp;

	return clonedInput;
}

const pickMatchingIndices = (board: BoardArray): BoardArray => {
	const firstRow = board.slice(6, 9);
	const secondRow = board.slice(11, 14);
	const thirdRow = board.slice(16, 19);

	return [...firstRow, ...secondRow, ...thirdRow];
};

const shuffle = (array: unknown[]): unknown[] => {
	let clonedArray = [...array];

	for (let i = clonedArray.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));

		[clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]];
	}

	return clonedArray;
};

export const getInitialTargetList = () => {
	const list = new Array(9).fill(true);

	return list.map(
		() => fullColourList[Math.floor(Math.random() * fullColourList.length)]
	);
};

export const getInitialBoardList = (): (COLORS | null)[] => {
	const randomBoard = shuffle(fullColourList) as (COLORS | null)[];
	const randomIndex = Math.floor(Math.random() * fullColourList.length);

	randomBoard.splice(randomIndex, 0, null);

	return randomBoard;
};

const getTargetIndex = (currentIndex: number, direction: string): number => {
	if (direction === 'top') {
		return currentIndex - 5;
	}

	if (direction === 'bottom') {
		return currentIndex + 5;
	}
	if (direction === 'left') {
		return currentIndex - 1;
	}

	return currentIndex + 1;
};

const isMoveValid = (
	board: BoardArray,
	index: number,
	direction: string
): boolean => {
	const targetIndex = getTargetIndex(index, direction);

	if (typeof board[targetIndex] === 'undefined') {
		return false;
	}

	return board[targetIndex] === null;
};

const Grid = () => {
	const [target, setTarget] = React.useState<COLORS[]>(
		getInitialTargetList()
	);
	const [board, setBoard] = React.useState<(COLORS | null)[]>(
		getInitialBoardList()
	);
	const [isVictory, setIsVictory] = React.useState<boolean>(false);
	const handleResetButtonPressed = () => {
		setTarget(getInitialTargetList());
		setBoard(getInitialBoardList());
	};

	const handleDirectionButtonPressed = (index: number, direction: string) => {
		const canMoveBeMade = isMoveValid(board, index, direction);

		if (!canMoveBeMade) {
			return;
		}

		setBoard(swapArrayItem(board, index, getTargetIndex(index, direction)));
	};

	const items = React.useMemo(() => {
		return board.map((color, index) => {
			if (color === null) {
				return <span />;
			}

			return (
				<GridItem
					color={color as COLORS}
					index={index}
					onDirectionButtonPressed={handleDirectionButtonPressed}
				>
					{index} {color}
				</GridItem>
			);
		});
	}, [board]);
	React.useEffect(() => {
		const matchingArea = pickMatchingIndices(board);

		console.log(matchingArea);
		console.log('is it solved', isEqual(matchingArea, target));

		setIsVictory(isEqual(matchingArea, target));
	}, [items]);

	return (
		<Root>
			<ButtonContainer>
				<button onClick={handleResetButtonPressed} type="button">
					Reset
				</button>
			</ButtonContainer>
			<Preview>
				{target.map((color, index) => (
					<PreviewItem key={index} color={color} />
				))}
			</Preview>
			{isVictory && <h2>You a winna</h2>}
			<Board>{items}</Board>
		</Root>
	);
};

export default Grid;
