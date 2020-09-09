import * as React from 'react';
import styled, { css } from 'styled-components';
import { COLORS } from '../Grid';

const Root = styled.div<{ color: COLORS }>`
	background-color: ${({ color }) => color};
	position: relative;
`;

const NavigateButton = styled.button<{ position: string }>`
	border: none;
	appearance: none;
	background-color: transparent;
	position: absolute;
	width: 50px;
	height: 50px;
	cursor: pointer;

	&:hover {
		background-color: rgba(0, 0, 0, 0.3);
	}

	${({ position }) => {
		switch (position) {
			case 'left':
				return css`
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				`;
			case 'right':
				return css`
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				`;
			case 'top':
				return css`
					left: 50%;
					top: 0;
					transform: translateX(-50%);
				`;
			case 'bottom':
				return css`
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
				`;
		}
	}}
`;

export const GridItem = ({
	color,
	index,
	onDirectionButtonPressed,
	children,
}: {
	color: COLORS;
	index: number;
	onDirectionButtonPressed: (index: number, direction: string) => void;
	children: React.ReactNode;
}) => {
	return (
		<Root color={color}>
			<NavigateButton
				position={'left'}
				onClick={() => onDirectionButtonPressed(index, 'left')}
			>
				&lt;
			</NavigateButton>
			<NavigateButton
				position={'right'}
				onClick={() => onDirectionButtonPressed(index, 'right')}
			>
				&gt;
			</NavigateButton>
			<NavigateButton
				position={'top'}
				onClick={() => onDirectionButtonPressed(index, 'top')}
			>
				/\
			</NavigateButton>
			<NavigateButton
				position={'bottom'}
				onClick={() => onDirectionButtonPressed(index, 'bottom')}
			>
				\/
			</NavigateButton>
			{children}
		</Root>
	);
};

export default GridItem;
