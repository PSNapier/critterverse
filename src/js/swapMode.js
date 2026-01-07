// MODE SWITCHING
let currentMode = 'breeding';
let isDOMReady = false;

function getCurrentMode() {
	return currentMode;
}

const modeFunctions = {
	breeding: null,
	randomizer: null,
};

function setMode(mode) {
	if (modeFunctions[mode] && isDOMReady) {
		currentMode = mode;
		modeFunctions[mode]();
		updateModeButton();
		updateTheme(mode);
	}
}

function updateTheme(mode) {
	document.documentElement.setAttribute('data-theme', mode);
}

function registerMode(mode, fn) {
	modeFunctions[mode] = fn;
	if (currentMode === mode && isDOMReady) {
		fn();
		updateModeButton();
		updateTheme(mode);
	}
}

function updateModeButton() {
	const breedingBtn = document.getElementById('mode-btn-breeding');
	const randomizerBtn = document.getElementById('mode-btn-randomizer');

	if (breedingBtn && randomizerBtn) {
		if (currentMode === 'breeding') {
			breedingBtn.classList.add('btn-selected');
			randomizerBtn.classList.remove('btn-selected');
		} else {
			randomizerBtn.classList.add('btn-selected');
			breedingBtn.classList.remove('btn-selected');
		}
	}
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
	isDOMReady = true;
	updateModeButton();
	updateTheme(currentMode);
	// Render initial mode if function is registered
	if (modeFunctions[currentMode]) {
		modeFunctions[currentMode]();
	}
});
