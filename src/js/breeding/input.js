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
	document.getElementById('sire-geno').value = 'S+XZ/nLi';
	document.getElementById('dam-geno').value = 'ZX/nVo';
	populateItems();

	function createSpeciesSelect(prefix) {
		const select = document.createElement('select');
		select.id = `${prefix}-species`;
		select.className =
			'ml-2 mb-2 rounded border px-2 py-1 text-sm align-middle';

		dict.species.forEach((species) => {
			const option = document.createElement('option');
			option.value = species;
			option.innerText =
				species.charAt(0).toUpperCase() + species.slice(1);
			select.appendChild(option);
		});

		const input = document.getElementById(`${prefix}-geno`);
		input.insertAdjacentElement('afterend', select);
	}

	createSpeciesSelect('sire');
	createSpeciesSelect('dam');

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
			const selectWrapper = document.createElement('div');
			selectWrapper.className = 'mb-2';

			const selectLabel = document.createElement('label');
			selectLabel.htmlFor = 'enchanted-tablet-selection';
			selectLabel.className = 'mr-2';
			selectLabel.innerText = 'Select species:';

			const select = document.createElement('select');
			select.id = 'enchanted-tablet-selection';
			select.className = 'ml-2 rounded border px-2 text-sm';

			dict.species.forEach((species) => {
				const option = document.createElement('option');
				option.value = species;
				option.innerText =
					species.charAt(0).toUpperCase() + species.slice(1);
				select.appendChild(option);
			});

			selectWrapper.appendChild(selectLabel);
			selectWrapper.appendChild(select);

			// Insert after enchanted-tablet checkbox label (not inside it)
			const enchantedTabletLabel =
				enchantedTabletCheckbox.parentElement;
			if (enchantedTabletLabel && enchantedTabletLabel.parentElement) {
				enchantedTabletLabel.parentElement.insertBefore(
					selectWrapper,
					enchantedTabletLabel.nextSibling
				);
			}
		}
	} else {
		// If not checked and dropdown exists, remove it
		const select = document.getElementById('enchanted-tablet-selection');
		if (select && select.parentElement) {
			select.parentElement.remove(); // remove wrapper div
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
