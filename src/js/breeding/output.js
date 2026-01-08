let items = {
	bouquetOfFlowers: true,
};

function Parent(parent) {
	this.geno = document.getElementById(`${parent}-geno`).value || '';
}
let sire = {};
let dam = {};

let critter = {
	geno: '',
};

function rollClutchSize() {
	if (items.bouquetOfFlowers) {
		return 10;
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
	sire = new Parent('sire');
	dam = new Parent('dam');

	const clutchSize = rollClutchSize();

	// Temp values for now
	const mutation = '[Mutation]';
	const species = 'Species';
	const sex = 'Sex';
	const pheno = 'Pheno';
	const carredPheno = 'Carried Pheno';
	const geno = 'Geno';

	const critters = [];
	for (let i = 0; i < clutchSize; i++) {
		const geno = rollGenoBase();
		const critterForm = `${mutation} ${species} | ${sex}
${pheno} (${carredPheno})
${geno}`;
		critters.push(critterForm);
	}

	return critters.join('\n\n');
}
