// MODE SWITCHING
let currentMode = 'roller';
let isDOMReady = false;

const modeFunctions = {
	roller: null,
	randomizer: null,
};

function setMode(mode) {
	if (modeFunctions[mode] && isDOMReady) {
		currentMode = mode;
		modeFunctions[mode]();
		updateModeButton();
	}
}

function registerMode(mode, fn) {
	modeFunctions[mode] = fn;
	if (currentMode === mode && isDOMReady) {
		fn();
		updateModeButton();
	}
}

function updateModeButton() {
	const btn = document.getElementById('mode-switch-btn');
	if (btn) {
		btn.textContent =
			currentMode === 'roller'
				? 'Switch to Randomizer'
				: 'Switch to Roller';
	}
}

function switchMode() {
	const newMode = currentMode === 'roller' ? 'randomizer' : 'roller';
	setMode(newMode);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
	isDOMReady = true;
	updateModeButton();
	// Render initial mode if function is registered
	if (modeFunctions[currentMode]) {
		modeFunctions[currentMode]();
	}
});
