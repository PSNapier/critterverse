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
