function renderRollerInput() {
	document.getElementById('input').innerHTML = `<h1>Breeding!</h1>`;
}

// Register with swapMode
if (typeof registerMode === 'function') {
	registerMode('breeding', renderRollerInput);
} else {
	// Fallback if swapMode hasn't loaded yet
	window.addEventListener('load', () => {
		if (typeof registerMode === 'function') {
			registerMode('breeding', renderRollerInput);
		}
	});
}
