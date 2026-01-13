function renderRandomizerInput() {
	// Preserve checkbox states before clearing
	const checkboxStates = {};
	for (const item of dict.items) {
		const checkboxId = item.toLowerCase().replace(/\s+/g, '-');
		const checkbox = document.getElementById(checkboxId);
		if (checkbox) {
			checkboxStates[checkboxId] = checkbox.checked;
		}
	}

	const inputDiv = document.getElementById('input');
	inputDiv.innerHTML = `<label class="block text-lg font-semibold" for="egg-rarity">Egg Rarity:</label>`;

	const eggRaritySelect = createSelect('egg-rarity', '', [
		'common',
		'uncommon',
		'rare',
	]);
	eggRaritySelect.id = 'egg-rarity';
	inputDiv.appendChild(eggRaritySelect);

	// Restore checkbox states
	for (const [checkboxId, checked] of Object.entries(checkboxStates)) {
		const checkbox = document.getElementById(checkboxId);
		if (checkbox) {
			checkbox.checked = checked;
		}
	}
}

// Register with swapMode using centralized helper
registerModeHelper('randomizer', renderRandomizerInput, null, () => {
	if (typeof generateRandomCritter === 'function') {
		return generateRandomCritter();
	}
	return '';
});
