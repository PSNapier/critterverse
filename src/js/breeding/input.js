function renderRollerInput() {
	document.getElementById('input').innerHTML = `<h1>Breeding!</h1>`;
	updateBreedingOutput();
}

function updateBreedingOutput() {
	const outputDiv = document.getElementById('output');
	if (typeof generateBreedingOutput === 'function') {
		const outputForm = generateBreedingOutput();
		outputDiv.innerHTML = `<pre style="text-align: center; margin: 0;">${outputForm}</pre><button id="roll-btn" class="roll-btn">Roll</button>`;
		// Re-attach roll button after updating output
		if (typeof setupRollButton === 'function') {
			setupRollButton();
		}
	}
}

// Register with swapMode using centralized helper
registerModeHelper('breeding', renderRollerInput, updateBreedingOutput, () => {
	if (typeof generateBreedingOutput === 'function') {
		return generateBreedingOutput();
	}
	return '';
});
