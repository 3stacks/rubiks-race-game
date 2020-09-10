import React from 'react';
import Grid from '../Grid';
import styled from 'styled-components';

const Root = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

function App() {
	return (
		<Root>
			<Grid />
		</Root>
	);
}

export default App;
