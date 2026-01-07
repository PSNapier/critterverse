function renderRollerInput() {
	document.getElementById('input').innerHTML =
		`Sire: <input type="text" id="sire-geno"/><br>Dam: <input type="text" id="dam-geno" />`;
	document.getElementById('sire-geno').value = 'XX';
	document.getElementById('dam-geno').value = 'ZZ';
	updateBreedingOutput();
}

function updateBreedingOutput() {
	const outputContent = document.getElementById('output-content');
	if (outputContent && typeof generateBreedingOutput === 'function') {
		const outputForm = generateBreedingOutput();
		outputContent.innerHTML = `<pre style="text-align: center; margin: 0;">${outputForm}</pre>`;
	}
}

// Register with swapMode using centralized helper
registerModeHelper('breeding', renderRollerInput, updateBreedingOutput, () => {
	if (typeof generateBreedingOutput === 'function') {
		return generateBreedingOutput();
	}
	return '';
});
