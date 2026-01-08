// TOOLBOX

function reload() {
	window.location.reload();
}

function rng(max) {
	const rng = Math.floor(Math.random() * max) + 1;
	return rng;
}

function rngRange(min, max) {
	const rng = Math.floor(Math.random() * (max - min + 1)) + min;
	return rng;
}

function randomizer(array) {
	// console.log(array);
	if (array.length > 0) {
		const random = array[Math.floor(Math.random() * array.length)];
		return random;
	} else {
		return '';
	}
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function punnetSquare(parent1, parent2) {
	let punnetResults = [];
	for (let i = 0; i < parent1.length; i++) {
		for (let j = 0; j < parent2.length; j++) {
			const combo = parent1[i] + parent2[j];
			punnetResults.push(combo);
		}
	}
	return punnetResults;
}

function matchy(str, pattern) {
	const result = str.match(pattern);
	return result || [''];
}

function rollGene(sireGeno, damGeno, gene) {
	const dom = `${gene[1]}${gene[1]}`;
	const rec = `n${gene[1]}`;
	const basePattern = new RegExp(`(${dom}|${rec})`);
	const sireGenoMatch = matchy(sireGeno, basePattern)[0];
	const damGenoMatch = matchy(damGeno, basePattern)[0];

	const x = rng(100);
	if (sireGenoMatch === dom && damGenoMatch === dom) {
		return dom;
	} else if (
		(sireGenoMatch === dom && damGenoMatch === rec) ||
		(sireGenoMatch === rec && damGenoMatch === dom)
	) {
		if (x <= 50) {
			return dom;
		} else {
			return '';
		}
	} else if (sireGenoMatch === rec && damGenoMatch === rec) {
		if (x <= 25) {
			return dom;
		} else if (x <= 75) {
			return rec;
		} else {
			return '';
		}
	} else if (sireGenoMatch === rec || damGenoMatch === rec) {
		if (x <= 50) {
			return rec;
		} else {
			return '';
		}
	}
	return '';
}
// let a = ['a', 1, 'a', 2, '1'];
// let unique = a.filter( onlyUnique );// returns ['a', 1, 2, '1']

// const arrayToSort = ['apple', 'banana', 'cherry', 'date'];
// const sortOrder = ['banana', 'date', 'apple', 'cherry'];
// const sortedArray = arrayToSort.sortByArray(sortOrder);
// console.log(sortedArray);
Array.prototype.sortByArray = function (orderArr) {
	const map = new Map();
	orderArr.forEach((val, index) => map.set(val, index));
	return this.sort((a, b) => map.get(a) - map.get(b));
};

// string.capitalizeStr();
// TODO: capitalize no worky with opening parenthesis even though regexr says it should?
String.prototype.capitalizeStr = function () {
	return this.replace(/(?:^|\(|\s|-|\/)\S/g, function (a) {
		return a.toUpperCase();
	});
};
