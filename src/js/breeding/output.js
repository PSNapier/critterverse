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
	console.log(geno);

	let output = [];

	// base
	for (const gene of dict.genesBase) {
		if (geno.matchy(gene[1])) {
			// TODO: implement phenotype reading logic
		}
	}
	return output;
}

function generateBreedingOutput() {
	items = new checkItems();
	sire = new Parent('sire');
	dam = new Parent('dam');

	const clutchSize = rollClutchSize();

	const critters = [];
	for (let i = 0; i < clutchSize; i++) {
		const critter = new Critter();
		critter.mutation = rollMutation().capitalizeStr();
		critter.species = rollSpecies().capitalizeStr();
		critter.sex = rollSex().capitalizeStr();
		const base = rollGenoBase();
		const cont = rollGenoCont();
		critter.geno =
			cont && cont.length > 0 ? `${base}/${cont}` : `${base}`;
		critters.push(critter);
		const pheno = phenoReader(critter.geno);
		critter.pheno = pheno.length === 0 ? 'Pheno' : pheno;
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
