import React from 'react';
import Grid from '../Grid';
import styled from 'styled-components';

const Root = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100%;
	max-width: 1024px;
	margin: 0 auto;
`;

function App() {
	return (
		<Root>
			<Grid />
		</Root>
	);
}

export default App;
