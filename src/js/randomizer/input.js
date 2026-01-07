function renderRandomizerInput() {
	document.getElementById('input').innerHTML = `<h1>Randomizer!</h1>`;
}

// Register with swapMode
if (typeof registerMode === 'function') {
	registerMode('randomizer', renderRandomizerInput);
} else {
	// Fallback if swapMode hasn't loaded yet
	window.addEventListener('load', () => {
		if (typeof registerMode === 'function') {
			registerMode('randomizer', renderRandomizerInput);
		}
	});
}
