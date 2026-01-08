// MODE SWITCHING
const DEFAULT_OUTPUT_MESSAGE = 'Click roll to begin!';
let currentMode = 'breeding';
let isDOMReady = false;

function getCurrentMode() {
	return currentMode;
}

const modeFunctions = {};
const modeSetupFunctions = {};
const modeRollFunctions = {};

function setMode(mode) {
	if (modeFunctions[mode] && isDOMReady) {
		currentMode = mode;
		modeFunctions[mode]();
		updateModeButton();
		updateTheme(mode);
		// Set default output content
		const outputContent = document.getElementById('output-content');
		if (outputContent) {
			outputContent.innerHTML = DEFAULT_OUTPUT_MESSAGE;
		}
		// Run setup function if available
		if (modeSetupFunctions[mode]) {
			modeSetupFunctions[mode]();
		}
		setupRollButton();
	}
}

function updateTheme(mode) {
	document.documentElement.setAttribute('data-theme', mode);
}

function registerMode(mode, renderFn, setupFn, rollFn) {
	modeFunctions[mode] = renderFn;
	if (setupFn) {
		modeSetupFunctions[mode] = setupFn;
	}
	if (rollFn) {
		modeRollFunctions[mode] = rollFn;
	}

	if (currentMode === mode && isDOMReady) {
		renderFn();
		updateModeButton();
		updateTheme(mode);
		// Set default output content
		const outputContent = document.getElementById('output-content');
		if (outputContent) {
			outputContent.innerHTML = DEFAULT_OUTPUT_MESSAGE;
		}
		if (setupFn) {
			setupFn();
		}
		setupRollButton();
	}
}

function updateModeButton() {
	// Find all mode buttons dynamically (pattern: mode-btn-{modeName})
	Object.keys(modeFunctions).forEach((mode) => {
		const btn = document.getElementById(`mode-btn-${mode}`);
		if (btn) {
			if (currentMode === mode) {
				btn.classList.add('btn-selected');
			} else {
				btn.classList.remove('btn-selected');
			}
		}
	});
}

// Centralized roll button handler
function setupRollButton() {
	const rollBtn = document.getElementById('roll-btn');
	if (rollBtn) {
		rollBtn.onclick = () => {
			const mode = getCurrentMode();
			if (modeRollFunctions[mode]) {
				const outputContent =
					document.getElementById('output-content');
				if (outputContent) {
					const outputForm = modeRollFunctions[mode]();
					outputContent.innerHTML = `${outputForm}`;
				}
			}
		};
	}
}

// Centralized registration helper - handles load timing and DOM ready state
function registerModeHelper(modeName, renderFn, setupFn, rollFn) {
	if (typeof registerMode === 'function') {
		registerMode(modeName, renderFn, setupFn, rollFn);
	} else {
		// Fallback if swapMode hasn't loaded yet
		window.addEventListener('load', () => {
			if (typeof registerMode === 'function') {
				registerMode(modeName, renderFn, setupFn, rollFn);
			}
		});
	}

	// Execute setup function on DOM ready if provided
	if (setupFn) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				if (
					typeof getCurrentMode === 'function' &&
					getCurrentMode() === modeName
				) {
					setupFn();
					setupRollButton();
				}
			});
		} else {
			if (
				typeof getCurrentMode === 'function' &&
				getCurrentMode() === modeName
			) {
				setupFn();
				setupRollButton();
			}
		}
	}
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
	isDOMReady = true;
	updateModeButton();
	updateTheme(currentMode);
	// Set default output content
	const outputContent = document.getElementById('output-content');
	if (outputContent) {
		outputContent.innerHTML = 'Click roll to begin!';
	}
	// Render initial mode if function is registered
	if (modeFunctions[currentMode]) {
		modeFunctions[currentMode]();
		// Run setup function if available
		if (modeSetupFunctions[currentMode]) {
			modeSetupFunctions[currentMode]();
		}
		setupRollButton();
	}
});
