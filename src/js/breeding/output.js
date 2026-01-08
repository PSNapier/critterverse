function Parent(parent) {
	this.geno =
		document
			.getElementById(`${parent}-geno`)
			.value.split('/')
			.split(' ') || '';
}

function rollGenoBase() {
	// roll XZ base
	// roll special
	// roll lightened/shaded
	// roll modifiers
}

function generateBreedingOutput() {
	const sire = new Parent('sire');
	const dam = new Parent('dam');
	console.log(sire, dam);

	// Temp values for now
	const mutation = '[Mutation]';
	const species = 'Species';
	const sex = 'Sex';
	const pheno = 'Pheno';
	const carredPheno = 'Carried Pheno';
	const geno = 'Geno';

	const outputForm = `${mutation} ${species} | ${sex}
${pheno} (${carredPheno})
${geno}`;

	return outputForm;
}
