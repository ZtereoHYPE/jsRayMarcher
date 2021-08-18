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
		r: 20,
		colour: [100, 40, 200]
	},
	// {
	// 	type: "plane",
	// 	normal: {
	// 		x: 0,
	// 		y: 1,
	// 		z: 0
	// 	},
	// 	point: {
	// 		x: 0,
	// 		y: 100,
	// 		x: 0
	// 	},
	// 	colour: [255, 200, 127]
	// },
]

let sphereArray = [];
let canvas;
let fragmentSize = 6;
let playerLocation;
let playerRotationY = 0;

let hyperParameters = {
	nearnessThreshold: 0.1,
	maximumDistance: 1000,
	maximumLoopsPerRay: 15,
	normalEpsilon: 0.0000000001,
	fadeDistanfeFromEdge: 200,
}

function setup() {
	playerLocation = createVector(0, 0, -100);
	generateSpheres()
	frameRate(50);
	canvas = createCanvas(400, 400);
	background(10);
}

function draw() {
	let lightVector = createVector(10 * Math.cos(frameCount / 10), -20, 10 * Math.sin(frameCount / 10))
	lightVector.normalize()
	background(10);
	noStroke();

	let angle = radians(playerRotationY);
	let yRotationMatrix = [
		[Math.cos(angle), 0, -Math.sin(angle)],
		[0, 1, 0],
		[Math.sin(angle), 0, Math.cos(angle)]
	]
	movePlayer()
	// Run this for each fragment
	for (let y = 1; y <= canvas.height; y += fragmentSize) {
		for (let x = 1; x <= canvas.width; x += fragmentSize) {
			// Create the UV coordinates for the fragment
			let u = x / (canvas.width / 2) - 1;
			let v = y / (canvas.height / 2) - 1;

			let closestObjectDistance;
			let currentRayLocation = playerLocation.copy()
			let maxCircles = 0;
			let closestObject;
			let closestObjectEverDistance = Infinity;

			let uvVector = createVector(u, v, 1).normalize();
			let rayVectorMatrix = [
				[uvVector.x, uvVector.y, uvVector.z]
			]

			let matriceVector = multiplyMatrices(rayVectorMatrix, yRotationMatrix);
			let correctVector = createVector(matriceVector[0][0], matriceVector[0][1], matriceVector[0][2]);

			// Loop until we find the closest object, we get too far, or it's taking too long
			do {
				// Get the closest object distance
				objectData = getSurfaceDistance(currentRayLocation);
				closestObjectDistance = objectData.distance;
				closestObject = objectData.object;
				if (closestObjectDistance < closestObjectEverDistance) {
					closestObjectEverDistance = closestObjectDistance;
				}

				// Advance the ray of the rotated ray
				currentRayLocation.x += correctVector.x * closestObjectDistance;
				currentRayLocation.y += correctVector.y * closestObjectDistance;
				currentRayLocation.z += correctVector.z * closestObjectDistance;
				maxCircles++
			} while (closestObjectDistance > hyperParameters.nearnessThreshold && currentRayLocation.dist(playerLocation) < hyperParameters.maximumDistance && maxCircles < hyperParameters.maximumLoopsPerRay);

			// This is basically the fragment shader
			// if (closestObjectDistance < hyperParameters.nearnessThreshold) {}
			let fragmentColour = cycleCounterShader(currentRayLocation, closestObjectEverDistance, closestObjectDistance, lightVector, closestObject, maxCircles);
			if (fragmentColour) {
				fill(fragmentColour.r, fragmentColour.g, fragmentColour.b);
				square(x, y, fragmentSize);
			}
		}
	}
	fill("white");
	text(frameRate(), 20, 20);
}