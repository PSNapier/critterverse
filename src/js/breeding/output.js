function checkItems() {
	this.pinkRose = isChecked('pink-rose');
	this.blueRose = isChecked('blue-rose');
	this.bouquetOfFlowers = isChecked('bouquet-of-flowers');
	this.strangeVial = isChecked('strange-vial');
	this.enchantedTablet = isChecked('enchanted-tablet');
	this.enchantedTabletSpecies = document.getElementById(
		'enchanted-tablet-selection'
	)
		? document.getElementById('enchanted-tablet-selection').value
		: '';
}
let items = {};

function Parent(parent) {
	this.geno = document.getElementById(`${parent}-geno`).value || '';
	this.mutation = document.getElementById(`${parent}-mutation`).value || '';
	this.species = document.getElementById(`${parent}-species`).value || '';
}
let sire = {};
let dam = {};

function Critter() {
	this.mutation = '';
	this.species = '';
	this.sex = '';
	this.pheno = '';
	this.geno = '';
}

function rollClutchSize() {
	if (items.strangeVial) {
		return 1;
	} else if (items.bouquetOfFlowers) {
		return 4;
	}
	const x = rng(100);
	if (x <= 20) {
		return 1;
	} else if (x <= 60) {
		return 2;
	} else if (x <= 90) {
		return 3;
	} else {
		return 4;
	}
}

function rollMutation() {
	if (items.strangeVial) {
		return randomizer(dict.mutations);
	}
	const x = rng(100);
	if (x <= 5) {
		return randomizer(dict.mutations);
	} else if (x <= 15) {
		return sire.mutation;
	} else if (x <= 25) {
		return dam.mutation;
	}
	return '';
}

function rollSpecies() {
	if (items.enchantedTablet) {
		return items.enchantedTabletSpecies;
	}
	return randomizer([sire.species, dam.species]);
}

function rollSex() {
	if (items.pinkRose) {
		return 'female';
	} else if (items.blueRose) {
		return 'male';
	}
	return randomizer(['male', 'female']);
}

function rollGenoBase() {
	let output = {
		xz: '',
		special: '',
		lightShade: [],
		modifiers: [],
	};

	// roll XZ base
	const basePattern = /(XX|XZ|ZX|ZZ)/;
	const sireGenoMatch = sire.geno.matchy(basePattern)[0].split('');
	const damGenoMatch = dam.geno.matchy(basePattern)[0].split('');
	output.xz = randomizer(punnetSquare(sireGenoMatch, damGenoMatch));

	// roll special
	const sireSpecialMatch = sire.geno.matchy(/S\+/)[0];
	const damSpecialMatch = dam.geno.matchy(/S\+/)[0];
	output.special = randomizer(
		punnetSquare([sireSpecialMatch, ''], [damSpecialMatch, ''])
	);

	// roll lightened/shaded
	for (const gene of dict.genesLightShade) {
		const result = rollGene(sire.geno, dam.geno, gene);
		if (result) {
			output.lightShade.push(result);
		}
	}

	// roll modifiers
	for (const gene of dict.genesModifiers) {
		const result = rollGene(sire.geno, dam.geno, gene);
		if (result) {
			output.modifiers.push(result);
		}
	}

	// tidy
	return `${output.special}${output.xz}${
		output.lightShade.length > 0 ? '/' + output.lightShade.join('/') : ''
	}${output.modifiers.length > 0 ? '/' + output.modifiers.join('/') : ''}`;
}

function rollGenoCont() {
	let output = {
		appy: [],
		realistic: [],
		carrier: [],
	};

	// roll realistic
	for (const gene of dict.genesRealistic) {
		const result = rollGene(sire.geno, dam.geno, gene);
		if (result) {
			output.realistic.push(result);
		}
		if (gene[0] === 'appaloosa') {
			for (const gene of ['PATN1', 'PATN2']) {
				const result = rollGene(sire.geno, dam.geno, gene);
				if (result) {
					output.realistic.push(result);
				}
			}
		}
	}

	// roll carrier
	for (const gene of dict.genesCarrier) {
		const result = rollGene(sire.geno, dam.geno, gene);
		if (result) {
			output.carrier.push(result);
		}
	}

	return [
		output.appy.join('/'),
		output.realistic.join('/'),
		output.carrier.join('/'),
	]
		.filter(Boolean)
		.join('/');
}

function phenoReader(geno) {
	let base = [];
	let carrier = [];

	// base
	for (const gene of dict.genesBase) {
		if (geno.searchy(`(?<=(S\\+)*)${gene[1]}`)) {
			base.push(gene[0]);
		}
	}

	// base modifiers
	let modifiersDom = [];
	let modifiersRec = [];
	let modifier = '';
	let modifiersCarried = [];
	for (const gene of dict.genesModifiers) {
		let dom = `${gene[1]}${gene[1]}`;
		let rec = `n${gene[1]}`;
		if (geno.searchy(dom)) {
			modifiersDom.push(gene[0]);
		} else if (geno.searchy(rec)) {
			modifiersRec.push(gene[0]);
		}
	}
	if (modifiersDom.length > 0) {
		modifier = randomizer(modifiersDom);
		const index = modifiersDom.indexOf(modifier);
		if (index !== -1) {
			modifiersDom.splice(index, 1);
		}
		modifiersCarried = [...modifiersDom, ...modifiersRec];
	} else if (modifiersRec.length > 0) {
		modifier = randomizer(modifiersRec);
		const index = modifiersRec.indexOf(modifier);
		if (index !== -1) {
			modifiersRec.splice(index, 1);
		}
		modifiersCarried = [...modifiersRec];
	}
	if (modifier) {
		base.unshift(modifier);
	}
	carrier = [...carrier, ...modifiersCarried];

	// base special & lightshade
	if (geno.search(/\bS\+(?=[XZ]{2})\b/) !== -1) {
		base.unshift('special');
	}
	let lightShade = [];
	for (const gene of dict.genesLightShade) {
		if (geno.searchy(`(${gene[1]}${gene[1]}|n${gene[1]})`)) {
			if (base.includes('special')) {
				carrier.push(gene[0]);
			} else {
				lightShade.push(gene[0]);
			}
		}
	}
	if (lightShade.length > 1) {
		let chosen = randomizer(lightShade);
		base.unshift(chosen);
		lightShade.splice(lightShade.indexOf(chosen), 1);
		carrier = lightShade;
	}

	// cont realistic
	let cont = [];
	for (const gene of dict.genesRealistic) {
		if (geno.searchy(`(${gene[1]}${gene[1]}|n${gene[1]})`)) {
			cont.push(gene[0]);
			if (gene[1] === 'Ap') {
				let tempAppy = [];
				for (const appy of dict.genesAppy) {
					if (geno.searchy(appy[1])) {
						tempAppy.push(appy[0]);
					}
				}
				const index = cont.indexOf(gene[0]);
				if (tempAppy.length > 0) {
					cont[index] = `${tempAppy.join(' ')} ${cont[index]}`;
				}
			}
			continue;
		}
		if (gene[1] === 'Ap') {
			for (const appy of dict.genesAppy) {
				if (geno.searchy(appy[1])) {
					carrier.push(appy[0]);
				}
			}
		}
	}

	// cont carrier
	for (const gene of dict.genesCarrier) {
		const dom = `${gene[1]}${gene[1]}`;
		const rec = `n${gene[1]}`;
		if (geno.searchy(dom)) {
			cont.push(gene[0]);
		} else if (geno.searchy(rec)) {
			carrier.push(gene[0]);
		}
	}

	// output
	let baseString = base.map((o) => o.capitalizeStr()).join(' ');
	let contString = cont.map((c) => c.capitalizeStr()).join(', ');
	let carrierString = carrier.map((c) => c.capitalizeStr()).join(', ');

	let output = baseString;
	if (cont.length > 0) {
		output += ` and ${contString}`;
	}
	if (carrier.length > 0) {
		output += ` (${carrierString})`;
	}

	return output;
}

function generateBreedingOutput() {
	items = new checkItems();
	sire = new Parent('sire');
	dam = new Parent('dam');

	const clutchSize = rollClutchSize();

	function rollCritter() {
		const base = rollGenoBase();
		const cont = rollGenoCont();
		const geno = cont && cont.length > 0 ? `${base}/${cont}` : `${base}`;
		const pheno = phenoReader(geno);
		return [geno, pheno];
	}

	const critters = [];
	for (let i = 0; i < clutchSize; i++) {
		const critter = new Critter();
		critter.mutation = rollMutation().capitalizeStr();
		critter.species = rollSpecies().capitalizeStr();
		critter.sex = rollSex().capitalizeStr();
		if (critter.mutation === 'Chimera') {
			const normal = rollCritter();
			const chimera = rollCritter();
			critter.geno = `${normal[0]}//${chimera[0]}`;
			critter.pheno = `${normal[1]} // ${chimera[1]}`;
		} else {
			const normal = rollCritter();
			critter.geno = normal[0];
			critter.pheno = normal[1];
		}
		critters.push(critter);
	}

	const output = [];
	for (const critter of critters) {
		const critterForm = `${critter.mutation ? '[' + critter.mutation + '] ' : ''}${critter.species || 'Species'} | ${critter.sex || 'Sex'}
${critter.pheno || 'Pheno'}
${critter.geno || 'Geno'}`;
		output.push(critterForm);
	}

	return output.join('\n\n');
}
