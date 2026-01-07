function renderRandomizerInput() {
	document.getElementById('input').innerHTML = `<h1>Randomizer!</h1>`;
}

// Register with swapMode using centralized helper
registerModeHelper('randomizer', renderRandomizerInput, null, () => {
	if (typeof generateRandomCritter === 'function') {
		return generateRandomCritter();
	}
	return '';
});
