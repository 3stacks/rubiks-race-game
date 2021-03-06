import * as React from 'react';
import styled from 'styled-components';
import GridItem from '../GridItem';

import isEqual from 'lodash/isEqual';

const Grid = styled.div`
	display: grid;
	min-height: 100vh;
	grid-template-columns: 250px auto;
	grid-gap: 30px;
	width: 100%;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;

	span {
		font-size: 2rem;
	}
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
	width: 200px;
	height: 200px;
	background-color: black;
	border: 5px solid black;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	grid-gap: 5px;
`;

const Sidebar = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
`;

const Main = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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

const formatTime = (input: number): string => {
	const minutes = Math.floor(input / 60);
	const seconds = input - minutes * 60;

	return `${minutes > 9 ? minutes : `0${minutes}`}:${
		seconds > 9 ? seconds : `0${seconds}`
	}`;
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

const highlightCenter = (board: BoardArray): BoardArray => {
	return board.reduce((acc: BoardArray, curr: COLORS | null, index) => {
		const blackoutIndices = [
			0,
			1,
			2,
			3,
			4,
			5,
			9,
			10,
			14,
			15,
			19,
			20,
			21,
			22,
			23,
			24,
		];

		if (blackoutIndices.includes(index)) {
			return [...acc, null];
		}

		return [...acc, curr];
	}, []);
};

const getStorageItem = (key: string): any | null => {
	const itemFromStorage = localStorage.getItem(key);

	if (itemFromStorage) {
		return JSON.parse(itemFromStorage);
	}

	return null;
};

const setStorageItem = (key: string, item: any): void => {
	localStorage.setItem(key, JSON.stringify(item));
};

const Root = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

function App() {
	const [target, setTarget] = React.useState<COLORS[]>(
		getInitialTargetList()
	);
	const [board, setBoard] = React.useState<(COLORS | null)[]>(
		getInitialBoardList()
	);
	const [isVictory, setIsVictory] = React.useState<boolean>(false);
	const [isTimerActive, setIsTimerActive] = React.useState<boolean>(false);
	const [timerInterval, setTimerInterval] = React.useState<number | null>(
		null
	);
	const [highScores, setHighScores] = React.useState<any[]>(
		getStorageItem('highScores') || []
	);
	const [time, setTime] = React.useState<number>(0);
	const handleResetButtonPressed = () => {
		setTarget(getInitialTargetList());
		setBoard(getInitialBoardList());
		setTime(0);
		setIsTimerActive(false);
		setIsVictory(false);
	};
	React.useEffect(() => {
		setStorageItem('highScores', highScores);
	}, [highScores]);
	React.useEffect(() => {
		if (isTimerActive) {
			setTime(1);
			setTimerInterval(
				setInterval(() => {
					setTime((time) => time + 1);
				}, 1000)
			);
		} else {
			clearInterval(timerInterval as number);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					key={index}
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

		if (isGameFinished && !isVictory) {
			setBoard(highlightCenter);
			setIsTimerActive(false);
			setIsVictory(isGameFinished);
			setHighScores((state) => {
				return [...state, time].sort();
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);
	const parsedTime = React.useMemo(() => {
		return formatTime(time);
	}, [time]);

	return (
		<Root>
			<Grid>
				<Sidebar>
					<Preview>
						{target.map((color, index) => (
							<PreviewItem key={index} color={color} />
						))}
					</Preview>
					<ButtonContainer>
						<h2>Timer</h2>
						<span>{parsedTime}</span>
						{isVictory && <h2>You a winna</h2>}
						<button
							onClick={handleResetButtonPressed}
							type="button"
						>
							Reset
						</button>
					</ButtonContainer>
					<h2>How to play</h2>
					<p>
						Click a colored square adjacent to the empty square to
						move it to the empty slot. Your goal is to make the
						centre 3x3 grid match the one above. The timer will
						start when you first click on a block
					</p>
				</Sidebar>
				<Main>
					<Board>{items}</Board>
					<h2>High scores</h2>
					{highScores.length === 0 ? (
						<p>No scores yet...</p>
					) : (
						<ol>
							{highScores.map((highScore, index) => (
								<li key={index}>{formatTime(highScore)}</li>
							))}
						</ol>
					)}
					<button
						onClick={() => {
							setHighScores([]);
						}}
					>
						Reset scores
					</button>
				</Main>
			</Grid>
		</Root>
	);
}

export default App;
