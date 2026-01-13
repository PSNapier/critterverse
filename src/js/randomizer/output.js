// Testing override: set to array of gene codes to guarantee (e.g., ['Ap', 'Mo'])
const GUARANTEED_GENES = [];

function generateRandomCritter() {
	GUARANTEED_GENES.length = 0;
	const rarity = document.getElementById('egg-rarity').value;
	if (rarity === 'uncommon') {
		const allGenePools = [
			...dict.genesRealistic.map((g) => g[1]),
			...dict.genesCarrier.map((g) => g[1]),
		];
		GUARANTEED_GENES.push(randomizer(allGenePools));
	} else if (rarity === 'rare') {
		const allGenePools = [
			...dict.genesRealistic.map((g) => g[1]),
			...dict.genesCarrier.map((g) => g[1]),
		];
		GUARANTEED_GENES.push(
			randomizer(dict.genesModifiers.map((g) => g[1]))
		);
		const genePool = [...allGenePools];
		const gene1 = randomizer(genePool);
		GUARANTEED_GENES.push(gene1);
		const idx1 = genePool.indexOf(gene1);
		if (idx1 !== -1) genePool.splice(idx1, 1);
		const gene2 = randomizer(genePool);
		GUARANTEED_GENES.push(gene2);
	}

	const critter = {
		mutation: rng(100) <= 5 ? randomizer(dict.mutations) : '',
		species: randomizer(dict.species),
		sex: randomizer(['male', 'female']),
	};

	function rollCritter() {
		const genoBase = [
			[
				rng(100) <= 5 ? 'S+' : '',
				randomizer(dict.genesBase.map((g) => g[1])),
			].join(''),
			(() => {
				const pool = [
					...dict.genesLightShade.map((g) => g[1]),
					...dict.genesModifiers.map((g) => g[1]),
				];
				const picked = [];
				// Add guaranteed genes first
				for (const geneCode of GUARANTEED_GENES) {
					if (pool.includes(geneCode)) {
						picked.push(geneCode);
						pool.splice(pool.indexOf(geneCode), 1);
					}
				}
				const x = randomizer([0, 0, 0, 0, 1, 1, 1, 2, 2]);
				for (let i = 0; i < x && pool.length > 0; i++) {
					const choice = randomizer(pool);
					picked.push(choice);
					const idx = pool.indexOf(choice);
					if (idx !== -1) pool.splice(idx, 1);
				}
				// Remove duplicates if any (defensive, as above guarantees uniqueness)
				const uniquePicked = Array.from(new Set(picked));
				// Format with dom/rec notation
				const formatted = uniquePicked.map((gene) => {
					if (GUARANTEED_GENES.includes(gene)) {
						// Force dom form for guaranteed genes
						return `${gene}${gene}`;
					} else {
						const x = rng(100);
						if (x <= 10) {
							// dom form
							return `${gene}${gene}`;
						} else {
							// rec form
							return `n${gene}`;
						}
					}
				});
				return formatted.filter(Boolean);
			})(),
		];
		const genoCont = [
			// Roll up to 5 times, each with random chance, and pick unique results
			...(() => {
				const allGenes = [
					...dict.genesRealistic.map((g) => g[1]),
					...dict.genesCarrier.map((g) => g[1]),
				];
				const selected = [];
				const genePool = [...allGenes];

				// Add guaranteed genes first
				for (const geneCode of GUARANTEED_GENES) {
					if (genePool.includes(geneCode)) {
						selected.push(geneCode);
						genePool.splice(genePool.indexOf(geneCode), 1);
					}
				}
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
					if (GUARANTEED_GENES.includes(gene)) {
						// Force dom form for guaranteed genes
						selected[i] = `${gene}${gene}`;
					} else {
						const x = rng(100);
						if (x <= 10) {
							// dom form
							selected[i] = `${gene}${gene}`;
						} else {
							// rec form
							selected[i] = `n${gene}`;
						}
					}
				}
				// If Ap (appaloosa) is present, add PATN gene immediately after it
				for (let i = 0; i < selected.length; i++) {
					if (selected[i] === 'ApAp' || selected[i] === 'nAp') {
						// Pick PATN1 or PATN2
						const patnBase = randomizer(['PATN1', 'PATN2']);
						const x = rng(100);
						const patnFormatted =
							x <= 10
								? `${patnBase}${patnBase}`
								: `${patnBase}`;
						selected.splice(i + 1, 0, patnFormatted);
						break; // Only add one PATN gene
					}
				}
				return selected;
			})(),
		].filter(Boolean);

		const base = genoBase;
		const cont = genoCont;
		const geno =
			cont && cont.length > 0
				? `${base.join(',')},${cont.join(',')}`
				: `${base.join(',')}`;
		const pheno = phenoReader(geno);
		return [geno, pheno];
	}

	let geno, pheno;
	if (critter.mutation && critter.mutation.toLowerCase() === 'chimera') {
		const normal = rollCritter();
		const chimera = rollCritter();
		geno = `${normal[0]}//${chimera[0]}`;
		pheno = `${normal[1]} // ${chimera[1]}`;
	} else {
		const normal = rollCritter();
		geno = normal[0];
		pheno = normal[1];
	}

	const phenoString = pheno.length === 0 ? 'Pheno' : pheno;
	// For chimera, preserve // separator; for normal, convert commas to slashes
	const genoFormatted = geno.includes('//')
		? geno
				.replace(/,,/g, ',')
				.replace(/,+$/, '')
				.split('//')
				.map((g) => g.replace(/,+$/, '').replace(/,/g, '/'))
				.join('//')
		: geno.replace(/,,/g, ',').replace(/,+$/, '').replace(/,/g, '/');

	const outputForm = `${critter.mutation ? `[${critter.mutation.capitalizeStr()}] ` : ''}${critter.species.capitalizeStr()} | ${critter.sex.capitalizeStr()}
${phenoString}
${genoFormatted}`;

	return outputForm;
}
