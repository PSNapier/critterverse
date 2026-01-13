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

String.prototype.matchy = function (pattern) {
	const result = this.match(pattern);
	return result || [''];
};

String.prototype.searchy = function (pattern) {
	return this.search(new RegExp(`\\b(${pattern})\\b`)) !== -1;
};

function isChecked(elementId) {
	return document.getElementById(elementId).checked ? true : false;
}

function rollGene(sireGeno, damGeno, gene) {
	let dom, rec;
	if (typeof gene === 'string') {
		dom = `${gene}${gene}`;
		rec = `${gene}`;
	} else {
		dom = `${gene[1]}${gene[1]}`;
		rec = `n${gene[1]}`;
	}

	const basePattern = new RegExp(`(${dom}|${rec})`);
	const sireGenoMatch = sireGeno.matchy(basePattern)[0];
	const damGenoMatch = damGeno.matchy(basePattern)[0];

	if (sireGenoMatch === '' && damGenoMatch === '') {
		return '';
	}

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
	} else if (
		(sireGenoMatch === dom && damGenoMatch === '') ||
		(sireGenoMatch === '' && damGenoMatch === dom)
	) {
		return rec;
	} else if (
		(sireGenoMatch === rec && damGenoMatch === '') ||
		(sireGenoMatch === '' && damGenoMatch === rec)
	) {
		if (x <= 50) {
			return rec;
		} else {
			return '';
		}
	} else {
		console.log('rollGene() error!', sireGenoMatch, damGenoMatch);
	}
}

// let a = ['a', 1, 'a', 2, '1'];
// let unique = a.filter( onlyUnique );// returns ['a', 1, 2, '1']

// const arrayToSort = ['apple', 'banana', 'cherry', 'date'];
// const sortOrder = ['banana', 'date', 'apple', 'cherry'];
// const sortedArray = arrayToSort.sortByArray(sortOrder);
// console.log(sortedArray);
Array.prototype.sortByArray = function (orderArr) {};

// string.capitalizeStr();
// TODO: capitalize no worky with opening parenthesis even though regexr says it should?
String.prototype.capitalizeStr = function () {
	return this.replace(/(?:^|\(|\s|-|\/)\S/g, function (a) {
		return a.toUpperCase();
	});
};

function createSelect(prefix, type, options) {
	const select = document.createElement('select');
	select.id = `${prefix}-${type}`;
	select.className = 'ml-2 mb-2 rounded border px-1 text-sm align-middle';

	options.forEach((option) => {
		const optionElement = document.createElement('option');
		optionElement.value = option;
		optionElement.innerText =
			option.charAt(0).toUpperCase() + option.slice(1);
		select.appendChild(optionElement);
	});

	return select;
}
