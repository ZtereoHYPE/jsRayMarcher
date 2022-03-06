// Samples the surface distance at 4 points: pos, pos with a small x offset, pos with a small y offset and pos with a small z offset and uses the distance differences to estimate the surface normal.
function getSurfaceNormal(pos, objectArray) {
	const epsilon = hyperParameters.normalEpsilon;
	const surface = getSurfaceDistance(pos, objectArray);
	const xDistance = getObjectDistance(p5.Vector.add(pos, createVector(epsilon, 0, 0)), surface.object);
	const yDistance = getObjectDistance(p5.Vector.add(pos, createVector(0, epsilon, 0)), surface.object);
	const zDistance = getObjectDistance(p5.Vector.add(pos, createVector(0, 0, epsilon)), surface.object);
	let normal = createVector(xDistance - surface.distance, yDistance - surface.distance, zDistance - surface.distance);
	normal.normalize();
	return normal;
}

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
	if (object.type === "sphere") return pos.dist(object.vect) - object.r;
	else if (object.type === "plane") return Math.abs(p5.Vector.dot(object.normal, p5.Vector.sub(pos, object.point)));
};

// This is hardcoded for 1x3 times 3x3 matrix multiplication to be faster.
const multiplyMatrices = (a, b) => {
	let product = [[]];

	product[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0];
	product[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1];
	product[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2];

	return product;
}

// TODO: rewrite this bs based on reperak's work
function generateSpheres() {
	for (object of generatorArray) {
		if (object.type === "sphere") {
			sphereArray.push({
				vect: createVector(object.x, object.y, object.z),
				r: object.r,
				colour: object.colour,
				type: object.type
			})
		} else if (object.type === "plane") {
			sphereArray.push({
				normal: createVector(object.normal.x, object.normal.y, object.normal.z).normalize(),
				point: createVector(object.point.x, object.point.y, object.point.z),
				colour: object.colour,
				type: object.type
			});
		};
	};
};
