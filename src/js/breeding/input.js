function renderRollerInput() {
	document.getElementById('input').innerHTML = `<h1>Breeding!</h1>`;
	updateBreedingOutput();
}

function updateBreedingOutput() {
	const outputContent = document.getElementById('output-content');
	if (outputContent && typeof generateBreedingOutput === 'function') {
		const outputForm = generateBreedingOutput();
		outputContent.innerHTML = `<pre style="text-align: center; margin: 0;">${outputForm}</pre>`;
	}
}

// Register with swapMode using centralized helper
registerModeHelper('breeding', renderRollerInput, updateBreedingOutput, () => {
	if (typeof generateBreedingOutput === 'function') {
		return generateBreedingOutput();
	}
	return '';
});
