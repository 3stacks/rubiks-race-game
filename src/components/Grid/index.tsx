import * as React from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import GridItem from '../GridItem';

const Root = styled.div`
	height: 100%;
	width: 620px;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
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

const Header = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	margin-bottom: 15px;
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

const isMoveValid = (
	board: BoardArray,
	emptyCellIndex: number,
	index: number
): boolean => {
	return (
		emptyCellIndex === index - 1 ||
		emptyCellIndex === index + 1 ||
		emptyCellIndex === index + 5 ||
		emptyCellIndex === index - 5
	);
};

const Grid = () => {
	const [target, setTarget] = React.useState<COLORS[]>(
		getInitialTargetList()
	);
	const [board, setBoard] = React.useState<(COLORS | null)[]>(
		getInitialBoardList()
	);
	const [isVictory, setIsVictory] = React.useState<boolean>(false);
	const [isTimerActive, setIsTimerActive] = React.useState<boolean>(false);
	const [time, setTime] = React.useState<number>(0);
	const handleResetButtonPressed = () => {
		setTarget(getInitialTargetList());
		setBoard(getInitialBoardList());
	};
	React.useEffect(() => {
		const interval = setInterval(() => {
			setTime((time) => time + 1);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [isTimerActive]);
	const emptyCellIndex = React.useMemo<number>(() => {
		return board.findIndex((color) => color === null);
	}, [board]);
	const handleDirectionButtonPressed = (index: number) => {
		if (isVictory) {
			return;
		}

		if (!isTimerActive) {
			setIsTimerActive(true);
		}

		const canMoveBeMade = isMoveValid(board, emptyCellIndex, index);

		if (!canMoveBeMade) {
			return;
		}

		setBoard(swapArrayItem(board, index, emptyCellIndex));
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
				/>
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [board]);
	React.useEffect(() => {
		const matchingArea = pickMatchingIndices(board);
		const isGameFinished = isEqual(matchingArea, target);

		if (isGameFinished) {
			setIsVictory(isGameFinished);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);
	const parsedTime = React.useMemo(() => {
		const minutes = Math.floor(time / 60);
		const seconds = time - minutes * 60;

		return `${minutes}:${seconds}`;
	}, [time]);

	return (
		<Root>
			<Header>
				<ButtonContainer>
					<h2>Timer</h2>
					{parsedTime}
					<button onClick={handleResetButtonPressed} type="button">
						Reset
					</button>
				</ButtonContainer>
				<Preview>
					{target.map((color, index) => (
						<PreviewItem key={index} color={color} />
					))}
				</Preview>
			</Header>
			{isVictory && <h2>You a winna</h2>}
			<Board>{items}</Board>
		</Root>
	);
};

export default Grid;
