function checkItems() {
	this.pinkRose = isChecked('pink-rose');
	this.blueRose = isChecked('blue-rose');
	this.bouquetOfFlowers = isChecked('bouquet-of-flowers');
	this.strangeVial = isChecked('strange-vial');
	this.enchantedTablet = isChecked('enchanted-tablet');
}
let items = {};

function Parent(parent) {
	this.geno = document.getElementById(`${parent}-geno`).value || '';
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
	if (items.bouquetOfFlowers) {
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

function rollGenoBase() {
	let output = {
		xz: '',
		special: '',
		lightShade: [],
		modifiers: [],
	};

	// roll XZ base
	const basePattern = /(XX|XZ|ZX|ZZ)/;
	const sireGenoMatch = matchy(sire.geno, basePattern)[0].split('');
	const damGenoMatch = matchy(dam.geno, basePattern)[0].split('');
	output.xz = randomizer(punnetSquare(sireGenoMatch, damGenoMatch));

	// roll special
	const sireSpecialMatch = matchy(sire.geno, /S\+/)[0];
	const damSpecialMatch = matchy(dam.geno, /S\+/)[0];
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

function generateBreedingOutput() {
	items = new checkItems();
	sire = new Parent('sire');
	dam = new Parent('dam');

	const clutchSize = rollClutchSize();

	const critters = [];
	for (let i = 0; i < clutchSize; i++) {
		const critter = new Critter();
		critter.geno = rollGenoBase();
		critters.push(critter);
	}

	const output = [];
	for (const critter of critters) {
		const critterForm = `${critter.mutation || '[Mutation]'} ${critter.species || 'Species'} | ${critter.sex || 'Sex'}
${critter.pheno || 'Pheno'}
${critter.geno || 'Geno'}`;
		output.push(critterForm);
	}

	return output.join('\n\n');
}
