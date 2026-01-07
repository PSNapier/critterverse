function renderRandomizerInput() {
	document.getElementById('input').innerHTML = `<h1>Randomizer!</h1>`;
	// Re-attach roll button handler when switching to randomizer mode
	setupRollButton();
}

function setupRollButton() {
	const rollBtn = document.getElementById('roll-btn');
	if (rollBtn) {
		rollBtn.onclick = () => {
			if (
				typeof getCurrentMode === 'function' &&
				getCurrentMode() === 'randomizer'
			) {
				const outputDiv = document.getElementById('output');
				const outputForm = generateRandomCritter();
				outputDiv.innerHTML = `<pre style="text-align: center; margin: 0;">${outputForm}</pre><button id="roll-btn" class="roll-btn">Roll</button>`;
				// Re-attach event listener to the new button
				setupRollButton();
			}
		};
	}
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

// Set up roll button on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', setupRollButton);
} else {
	setupRollButton();
}
