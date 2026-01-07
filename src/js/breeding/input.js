function renderRollerInput() {
	document.getElementById('input').innerHTML = `<h1>Breeding!</h1>`;
	updateBreedingOutput();
}

function updateBreedingOutput() {
	const outputDiv = document.getElementById('output');
	const outputForm = generateBreedingOutput();
	outputDiv.innerHTML = `<pre style="text-align: center; margin: 0;">${outputForm}</pre><button id="roll-btn" class="roll-btn">Roll</button>`;
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

// Update output when DOM is ready and in breeding mode
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		if (
			typeof getCurrentMode === 'function' &&
			getCurrentMode() === 'breeding'
		) {
			updateBreedingOutput();
		}
	});
} else {
	if (
		typeof getCurrentMode === 'function' &&
		getCurrentMode() === 'breeding'
	) {
		updateBreedingOutput();
	}
}
