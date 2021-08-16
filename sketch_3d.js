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
	frameRate(10);
	canvas = createCanvas(400, 400);
	background(10);
	lightVector = createVector(10 * Math.cos(frameCount), -10, -10)
	lightVector.normalize()
}

function draw() {
	lightVector = createVector(10 * Math.cos(frameCount / 10), -20, 10 * Math.sin(frameCount / 10))
	lightVector.normalize()
	movePlayer()
	background(10);
	fill("white")
	for (let y = 1; y <= canvas.height; y += fragmentSize) {
		for (let x = 1; x <= canvas.width; x += fragmentSize) {
			let u = x / (canvas.width / 2) - 1;
			let v = y / (canvas.height / 2) - 1;

			let smallestSphereDistance = Infinity;
			let currentRayLocation = playerLocation.copy()
			let chosenSphere;

			let maxCircles = 0;
			while (smallestSphereDistance > 0.1 && currentRayLocation.dist(playerLocation) < 500 && maxCircles < 162) {
				let surfaceData = getSurfaceDistance(currentRayLocation)
				chosenSphere = surfaceData.object
				smallestSphereDistance = surfaceData.distance

				let correctVector = createVector(u, v, 1).normalize();
				let angle = radians(playerRotationY);

				let rayVectorMatrix = [
					[correctVector.x, correctVector.y, correctVector.z]
				]
				let YtransformationMatrix = [
					[Math.cos(angle), 0, -Math.sin(angle)],
					[0, 1, 0],
					[Math.sin(angle), 0, Math.cos(angle)]
				]

				// console.log(YtransformationMatrix)
				// let XtranformationMatrix = [
				// 	[1, 0, 0],
				// 	[0, Math.cos(playerRotationX), -Math.sin(playerRotationX)],
				// 	[0, Math.sin(playerRotationX), Math.cos(playerRotationX)]
				// ]

				let matriceVector = multiplyMatrices(rayVectorMatrix, YtransformationMatrix);

				currentRayLocation.add(createVector(matriceVector[0][0] * smallestSphereDistance, matriceVector[0][1] * smallestSphereDistance, matriceVector[0][2] * smallestSphereDistance));
				maxCircles++
			}

			if (smallestSphereDistance < 0.1) {
				let normal = getSurfaceNormal(currentRayLocation);
				let brightness = p5.Vector.dot(normal, lightVector);
				noStroke();
				let r = chosenSphere.colour[0];
				let g = chosenSphere.colour[1];
				let b = chosenSphere.colour[2];
				fill((normal.x*0.5 +0.5) * 255, (normal.y*0.5 +0.5) * 255, (normal.z*0.5 +0.5) * 255)
				// fill(max(0.2 * r, brightness * r), max(0.2 * g, brightness * g), max(0.2 * b, brightness * b))
				square(x, y, fragmentSize);
			}
		}
	}
	fill("white")
	text(frameRate(), 20, 20)
}

function movePlayer() {
	// up
	if (keyIsDown(87)) {
		playerLocation.z += 2
	}
	// down
	if (keyIsDown(83)) {
		playerLocation.z -= 2
	}

	if (keyIsDown(69)) {
		playerLocation.y -= 2
	}

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
		playerRotationY -= 1;
	}

	if (keyIsDown(RIGHT_ARROW)) {
		playerRotationY += 1;
	}

	// if (keyIsDown(UP_ARROW)) {
	// 	playerRotationX -= 200
	// }

	// if (keyIsDown(DOWN_ARROW)) {
	// 	playerRotationX += 200
	// }
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
		}
	}
	return {
		distance: smallestObjectDistance,
		object: closestObject
	}
}

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