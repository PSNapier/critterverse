function generateBreedingOutput() {
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
