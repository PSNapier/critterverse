const SIRE_GENO_DEFAULT = 'S+XZ/ApAp/PATN1';
const DAM_GENO_DEFAULT = 'ZX/nVo/nSy/nBi/nAr';

function renderRollerInput() {
	// Preserve checkbox states before clearing
	const checkboxStates = {};
	for (const item of dict.items) {
		const checkboxId = item.toLowerCase().replace(/\s+/g, '-');
		const checkbox = document.getElementById(checkboxId);
		if (checkbox) {
			checkboxStates[checkboxId] = checkbox.checked;
		}
	}

	document.getElementById('input').innerHTML =
		`<span class="font-semibold">Sire:</span> <input type="text" id="sire-geno"/><br><span class="font-semibold">Dam:</span> <input type="text" id="dam-geno"/><br><br>`;
	document.getElementById('sire-geno').value = SIRE_GENO_DEFAULT;
	document.getElementById('dam-geno').value = DAM_GENO_DEFAULT;
	populateItems();

	const sireGenoInput = document.getElementById('sire-geno');
	const sireLineBreak = document.createElement('br');
	sireGenoInput.insertAdjacentElement('afterend', sireLineBreak);
	const sireMutationSelect = createSelect('sire', 'mutation', [
		'No Mutation',
		...dict.mutations,
	]);
	// Set "No Mutation" option value to empty string
	const sireNoMutationOption = Array.from(sireMutationSelect.options).find(
		(opt) => opt.text === 'No Mutation'
	);
	if (sireNoMutationOption) {
		sireNoMutationOption.value = '';
	}
	sireLineBreak.insertAdjacentElement('afterend', sireMutationSelect);
	const sireSpeciesSelect = createSelect('sire', 'species', dict.species);
	sireMutationSelect.insertAdjacentElement('afterend', sireSpeciesSelect);

	const damGenoInput = document.getElementById('dam-geno');
	const damLineBreak = document.createElement('br');
	damGenoInput.insertAdjacentElement('afterend', damLineBreak);
	const damMutationSelect = createSelect('dam', 'mutation', [
		'No Mutation',
		...dict.mutations,
	]);
	// Set "No Mutation" option value to empty string
	const damNoMutationOption = Array.from(damMutationSelect.options).find(
		(opt) => opt.text === 'No Mutation'
	);
	if (damNoMutationOption) {
		damNoMutationOption.value = '';
	}
	damLineBreak.insertAdjacentElement('afterend', damMutationSelect);
	const damSpeciesSelect = createSelect('dam', 'species', dict.species);
	damMutationSelect.insertAdjacentElement('afterend', damSpeciesSelect);

	// Restore checkbox states
	for (const [checkboxId, checked] of Object.entries(checkboxStates)) {
		const checkbox = document.getElementById(checkboxId);
		if (checkbox) {
			checkbox.checked = checked;
		}
	}

	// Check if enchanted-tablet is checked and show dropdown if true
	const enchantedTabletCheckbox =
		document.getElementById('enchanted-tablet');
	if (enchantedTabletCheckbox && enchantedTabletCheckbox.checked) {
		// Avoid duplicate dropdowns
		if (!document.getElementById('enchanted-tablet-selection')) {
			const select = createSelect(
				'enchanted-tablet',
				'selection',
				dict.species
			);
			select.className = 'ml-2 rounded border px-2 text-sm';

			// Insert right after the checkbox, inside the same label
			enchantedTabletCheckbox.insertAdjacentElement(
				'afterend',
				select
			);
		}
	} else {
		// If not checked and dropdown exists, remove it
		const select = document.getElementById('enchanted-tablet-selection');
		if (select && select.parentElement) {
			select.remove();
		}
	}

	// Add a listener to enchanted-tablet checkbox to update UI on change
	if (
		enchantedTabletCheckbox &&
		!enchantedTabletCheckbox.hasAttribute('data-listener-added')
	) {
		enchantedTabletCheckbox.addEventListener('change', function () {
			renderRollerInput();
		});
		enchantedTabletCheckbox.setAttribute('data-listener-added', 'true');
	}
}

function populateItems() {
	for (const item of dict.items) {
		const label = document.createElement('label');
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		const checkboxId = item.toLowerCase().replace(/\s+/g, '-');
		checkbox.id = checkboxId;
		label.appendChild(document.createTextNode(item + ': '));
		label.appendChild(checkbox);
		label.className = 'mb-1 text-sm';
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
