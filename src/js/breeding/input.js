function renderRollerInput() {
	document.getElementById('input').innerHTML =
		`Sire: <input type="text" id="sire-geno"/><br>Dam: <input type="text" id="dam-geno"/><br><br>`;
	document.getElementById('sire-geno').value = 'S+XZ/nLi';
	document.getElementById('dam-geno').value = 'ZX/nVo';
	populateItems();
}

function populateItems() {
	for (const item of dict.items) {
		console.log(item);
		const label = document.createElement('label');
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		const checkboxId = item.toLowerCase().replace(/\s+/g, '-');
		checkbox.id = checkboxId;
		label.appendChild(document.createTextNode(item + ': '));
		label.appendChild(checkbox);
		label.className = 'block mb-1';
		document.getElementById('input').appendChild(label);
	}
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
