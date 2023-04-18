/////////////////////////////
//////// BENCHMARK 1: ///////
/// MATRIX MULTIPLICATION ///
/////////////////////////////

const cos = Math.cos(2);
const sin = Math.sin(2);
const matrix1 = [
    [cos, 0, -sin],
    [0, 1, 0],
    [sin, 0, cos]
]

const matrix2 = [
    [0.2400001, 0.1241148, 0.946645]
]

const multiplyMatrices1 = (a, b) => {
	let productRow = Array.apply(null, new Array(3)).map(Number.prototype.valueOf, 0);
	let product = new Array(1);
	product[0] = productRow.slice();
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			product[0][j] += a[0][k] * b[k][j];
		}
	}
	return product;
}

const multiplyMatrices2 = (a, b) => {
	let product = [[]];

	product[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0];
	product[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1];
	product[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2];

	return product;
}

// console.time("multiplyMatrices1");
// for (let i = 0; i < 1000000; i++) {
//     multiplyMatrices1(matrix2, matrix1); // 433.1ms
// }
// console.timeEnd("multiplyMatrices1");

// console.time("multiplyMatrices2");
// for (let i = 0; i < 1000000; i++) {
//     multiplyMatrices2(matrix2, matrix1); // 62.8ms
// }
// console.timeEnd("multiplyMatrices2");


/////////////////////////////
//////// BENCHMARK 2: ///////
/////// SURFACE NORMAL //////
/////////////////////////////
//Note: this benchmark must be loaded in the html file 
// 		and the console time lines must be copied in the setup funciton

function getSurfaceDistance(pos, objectArray) {
	let smallestObjectDistance = Infinity;
	let closestObject = null;

	for (object of objectArray) {
		if (object.type === "sphere") {
			let distance = pos.dist(object.vect) - object.r
			if (distance < smallestObjectDistance) {
				smallestObjectDistance = distance;
				closestObject = object;
			};
		}
		else if (object.type === "plane") {
			let distance = Math.abs(p5.Vector.dot(object.normal, p5.Vector.sub(pos, object.point)));
			if (distance < smallestObjectDistance) {
				smallestObjectDistance = distance;
				closestObject = object;
			};
		};
	};
	return {
		distance: smallestObjectDistance,
		object: closestObject
	};
};

function getObjectDistance(pos, object) {
	switch (object.type) {
		case "sphere": return pos.dist(object.vect) - object.r;
		case "plane": return Math.abs(p5.Vector.dot(object.normal, p5.Vector.sub(pos, object.point)));
	}
};

function getSurfaceNormal1(pos, objectArray) {
	const epsilon = hyperParameters.normalEpsilon;
	const surface = getSurfaceDistance(pos, objectArray);
	const xDistance = getObjectDistance(createVector(epsilon + pos.x, pos.y, pos.z), surface.object);
	const yDistance = getObjectDistance(createVector(pos.x, epsilon + pos.y, pos.z), surface.object);
	const zDistance = getObjectDistance(createVector(pos.x, pos.y, epsilon + pos.z), surface.object);
	let normal = createVector(xDistance - surface.distance, yDistance - surface.distance, zDistance - surface.distance);
	normal.normalize();
	return normal;
}

function getSurfaceNormal2(pos, objectArray) {
	const epsilon = hyperParameters.normalEpsilon;
	const surface = getSurfaceDistance(pos, objectArray);
	const xDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(epsilon, 0, 0)), objectArray);
	const yDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(0, epsilon, 0)), objectArray);
	const zDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(0, 0, epsilon)), objectArray);
	let normal = createVector(xDistance - surface.distance, yDistance - surface.distance, zDistance - surface.distance);
	normal.normalize();
	return normal;
}

console.time("getSurfaceNormal1");
for (let i = 0; i < 1000000; i++) {
	getSurfaceNormal1(playerLocation, sphereArray); // 429.6ms
}
console.timeEnd("getSurfaceNormal1");

console.time("getSurfaceNormal2");
for (let i = 0; i < 1000000; i++) {
    getSurfaceNormal2(playerLocation, sphereArray); // 612.7ms
}
console.timeEnd("getSurfaceNormal2");