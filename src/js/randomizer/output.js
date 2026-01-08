function generateRandomCritter() {
	const critter = {
		mutation: rng(100) <= 5 ? randomizer(dict.mutations) : '',
		species: randomizer(dict.species),
		sex: randomizer(['male', 'female']),
		genoBase: randomizer(dict.genesBase.map((g) => g[1])),
		genoCont: [
			rng(100) <= 5 ? randomizer(dict.genesAppy.map((g) => g[1])) : '',
			// Roll up to 5 times, each with random chance, and pick unique results
			...(() => {
				const allGenes = [
					...dict.genesRealistic.map((g) => g[1]),
					...dict.genesCarrier.map((g) => g[1]),
				];
				const selected = [];
				const genePool = [...allGenes];
				for (let i = 0; i < 5; i++) {
					if (rng(100) < 40 && genePool.length > 0) {
						// adjust chance as needed
						const picked = randomizer(genePool);
						selected.push(picked);
						genePool.splice(genePool.indexOf(picked), 1);
					}
				}
				for (let i = 0; i < selected.length; i++) {
					const gene = selected[i];
					const x = rng(100);
					if (x <= 10) {
						// dom form
						selected[i] = `${gene}${gene}`;
					} else {
						// rec form
						selected[i] = `n${gene}`;
					}
				}
				return selected;
			})(),
		].filter(Boolean),
	};

	const outputForm = `${critter.mutation ? `[${critter.mutation.capitalizeStr()}] ` : ''}${critter.species.capitalizeStr()} | ${critter.sex.capitalizeStr()}
Pheno (Carried Pheno)
${critter.genoBase}${critter.genoCont.length ? '/' + critter.genoCont.join('/') : ''}`;

	return outputForm;
}
