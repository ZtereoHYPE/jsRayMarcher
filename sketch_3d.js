// TODO: rewrite this bs based on reperak's work
let generatorArray = [
	{
		type: "sphere",
		x: -30,
		y: 30,
		z: 10,
		r: 30,
		colour: [250, 228, 220]
	},
	{
		type: "sphere",
		x: 50,
		y: 0,
		z: 80,
		r: 30,
		colour: [100, 40, 200]
	},
	{
		type: "plane",
		normal: {
			x: 0,
			y: 1,
			z: 0
		},
		point: {
			x: 0,
			y: 100,
			x: 0
		},
		colour: [255, 200, 127]
	},
]
let sphereArray = [];
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
			})
		}
	}
}

let canvas;
let vectorArray = [];
let fragmentSize = 6;
let playerLocation;
let playerRotationY = 0;
let playerRotationX = 0;
let lightVector;

function setup() {
	playerLocation = createVector(0, 0, -100);
	generateSpheres()
	frameRate(60);
	canvas = createCanvas(400, 400);
	background(10);
}

function draw() {
	lightVector = createVector(10 * Math.cos(frameCount / 10), -20, 10 * Math.sin(frameCount / 10))
	lightVector.normalize()
	movePlayer()
	background(10);
	fill("white")
	noStroke();
	let angle = radians(playerRotationY);
	let yRotationMatrix = [
		[Math.cos(angle), 0, -Math.sin(angle)],
		[0, 1, 0],
		[Math.sin(angle), 0, Math.cos(angle)]
	]
	// Run this for each fragment
	for (let y = 1; y <= canvas.height; y += fragmentSize) {
		for (let x = 1; x <= canvas.width; x += fragmentSize) {
			// Create the UV coordinates for the fragment
			let u = x / (canvas.width / 2) - 1;
			let v = y / (canvas.height / 2) - 1;

			let closestObjectDistance = Infinity;
			let currentRayLocation = playerLocation.copy()
			let maxCircles = 0;

			let uvVector = createVector(u, v, 1).normalize();
			let rayVectorMatrix = [
				[uvVector.x, uvVector.y, uvVector.z]
			]
			let matriceVector = multiplyMatrices(rayVectorMatrix, yRotationMatrix);
			let correctVector = createVector(matriceVector[0][0], matriceVector[0][1], matriceVector[0][2]);

			// Loop until we find the closest object, we get too far, or it's taking too long
			while (closestObjectDistance > 0.1 && currentRayLocation.dist(playerLocation) < 2000) {
				// Get the closest object distance
				closestObjectDistance = getSurfaceDistance(currentRayLocation).distance;

				// Advance the ray of the rotated ray
				currentRayLocation.x += correctVector.x * closestObjectDistance;
				currentRayLocation.y += correctVector.y * closestObjectDistance;
				currentRayLocation.z += correctVector.z * closestObjectDistance;
				maxCircles++
			}

			if (closestObjectDistance < 0.1) {
				let closestObject = getSurfaceDistance(currentRayLocation).object;
				let normal = getSurfaceNormal(currentRayLocation);
				let brightness = p5.Vector.dot(normal, lightVector);
				let minimumBrightness = 0.2;
				let r = closestObject.colour[0];
				let g = closestObject.colour[1];
				let b = closestObject.colour[2];

				fill((normal.x * 0.5 + 0.5) * 255, (normal.y * 0.5 + 0.5) * 255, (normal.z * 0.5 + 0.5) * 255)
				// fill(max(minimumBrightness * r, brightness * r), max(minimumBrightness * g, brightness * g), max(minimumBrightness * b, brightness * b))
				square(x, y, fragmentSize);
			}
		}
	}
	fill("white")
	text(frameRate(), 20, 20)
}

function movePlayer() {
	// forward
	if (keyIsDown(87)) {
		let angle = radians(playerRotationY);
		let yRotationMatrix = [
			[Math.cos(angle), 0, -Math.sin(angle)],
			[0, 1, 0],
			[Math.sin(angle), 0, Math.cos(angle)]
		]
		let rayVectorMatrix = [
			[playerLocation.x, playerLocation.y, playerLocation.z]
		]
		let matriceVector = multiplyMatrices(rayVectorMatrix, yRotationMatrix);
		playerLocation.add(createVector(matriceVector[0][0], matriceVector[0][1], matriceVector[0][2]).normalize().mult(-2))
	}
	// bakcward
	if (keyIsDown(83)) {
		let angle = radians(playerRotationY);
		let yRotationMatrix = [
			[Math.cos(angle), 0, -Math.sin(angle)],
			[0, 1, 0],
			[Math.sin(angle), 0, Math.cos(angle)]
		]
		let rayVectorMatrix = [
			[playerLocation.x, playerLocation.y, playerLocation.z]
		]
		let matriceVector = multiplyMatrices(rayVectorMatrix, yRotationMatrix);
		playerLocation.add(createVector(matriceVector[0][0], matriceVector[0][1], matriceVector[0][2]).normalize().mult(2))
	}
	// up
	if (keyIsDown(69)) {
		playerLocation.y -= 2
	}
	// down
	if (keyIsDown(81)) {
		playerLocation.y += 2
	}
	// left
	if (keyIsDown(65)) {
		playerLocation.x -= 2
	}
	// right
	if (keyIsDown(68)) {
		playerLocation.x += 2
	}

	if (keyIsDown(LEFT_ARROW)) {
		playerRotationY -= 3;
	}

	if (keyIsDown(RIGHT_ARROW)) {
		playerRotationY += 3;
	}
}

// Samples the surface distance at 4 points: pos, pos with a small x offset, pos with a small y offset and pos with a small z offset and uses the distance differences to estimate the surface normal.
function getSurfaceNormal(pos) {
	const epsilon = 0.0000000001;
	const centerDistance = getSurfaceDistance(pos).distance;
	const xDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(epsilon, 0, 0))).distance;
	const yDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(0, epsilon, 0))).distance;
	const zDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(0, 0, epsilon))).distance;
	let normal = createVector(xDistance - centerDistance, yDistance - centerDistance, zDistance - centerDistance);
	normal.normalize();
	return normal;
}

function getSurfaceDistance(pos) {
	let smallestObjectDistance = Infinity;
	let closestObject = null;

	for (object of sphereArray) {
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

// This is hardcoded for 1x3 and 3x3 matrix multiplication to be faster.
const multiplyMatrices = (a, b) => {
	let productRow = Array.apply(null, new Array(3)).map(Number.prototype.valueOf, 0);
	let product = new Array(1);
	for (let p = 0; p < 1; p++) {
		product[p] = productRow.slice();
	}
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			product[0][j] += a[0][k] * b[k][j];
		}
	}
	return product;
}