import * as React from 'react';
import styled from 'styled-components';
import { COLORS } from '../App';

const Root = styled.button<{ color: COLORS }>`
	background-color: ${({ color }) => color};
	border: none;
	appearance: none;
	cursor: pointer;
`;

export const GridItem = ({
	color,
	index,
	onDirectionButtonPressed,
	children,
}: {
	color: COLORS;
	index: number;
	onDirectionButtonPressed: (index: number) => void;
	children?: React.ReactNode;
}) => {
	return (
		<Root color={color} onClick={() => onDirectionButtonPressed(index)}>
			{children}
		</Root>
	);
};

export default GridItem;
