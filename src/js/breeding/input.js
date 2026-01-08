function renderRollerInput() {
	document.getElementById('input').innerHTML =
		`Sire: <input type="text" id="sire-geno"/><br>Dam: <input type="text" id="dam-geno" />`;
	document.getElementById('sire-geno').value = 'S+XZ/nLi';
	document.getElementById('dam-geno').value = 'ZX/nVo';
}

function updateBreedingOutput() {
	const outputContent = document.getElementById('output-content');
	if (outputContent && typeof generateBreedingOutput === 'function') {
		const outputForm = generateBreedingOutput();
		outputContent.innerHTML = `${outputForm}`;
	}
}

// Register with swapMode using centralized helper
registerModeHelper('breeding', renderRollerInput, null, () => {
	if (typeof generateBreedingOutput === 'function') {
		return generateBreedingOutput();
	}
	return '';
});
