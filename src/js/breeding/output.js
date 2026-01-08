function Parent(parent) {
	this.geno = document.getElementById(`${parent}-geno`).value || '';
}
let sire = {};
let dam = {};

let critter = {
	geno: '',
};

function rollGenoBase() {
	let output = {
		xz: '',
		special: '',
		lightShade: [],
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
	// for (const gene of dict.genesLightShade) {
	// 	const basePattern = new RegExp(
	// 		`(${gene[1]}${gene[1]}|(?<=n)${gene[1]})`
	// 	);
	// 	const sireGenoMatch = matchy(sire.geno, basePattern)[0];
	// 	const damGenoMatch = matchy(dam.geno, basePattern)[0];
	// 	console.log(sireGenoMatch, damGenoMatch);
	// 	output.lightShade = randomizer();
	// }

	// roll modifiers

	// tidy
	return `${output.special}${output.xz}`;
}

function generateBreedingOutput() {
	sire = new Parent('sire');
	dam = new Parent('dam');

	rollGenoBase();

	// Temp values for now
	const mutation = '[Mutation]';
	const species = 'Species';
	const sex = 'Sex';
	const pheno = 'Pheno';
	const carredPheno = 'Carried Pheno';
	const geno = 'Geno';

	const outputForm = `${mutation} ${species} | ${sex}
${pheno} (${carredPheno})
${rollGenoBase()}`;

	return outputForm;
}
