let generatorArray = [
	{
		type: "sphere",
		x: -30,
		y: 30,
		z: 10,
		r: 30,
		colour: [ 250, 228, 220 ]
	},
	{
		type: "sphere",
		x: 50,
		y: 0,
		z: 80,
		r: 35,
		colour: [ 100, 40, 200 ]
	},

	//centered sphere
	{
		type: "sphere",
		x: 50,
		y: 50,
		z: 50,
		r: 30,
		colour: [ 200, 10, 200 ]
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
		colour: [ 255, 200, 127 ]
	},
]

let sphereArray = [];
let canvas;
let fragmentSize = 3;
let playerLocation;
let playerRotationY = 0;
let lightVector;

let hyperParameters = {
	nearnessThreshold: 0.1,
	maximumDistance: 500,
	maximumLoopsPerRay: 100,
	normalEpsilon: 0.000001,
	fadeDistanfeFromEdge: 300,
}

function setup() {
	playerLocation = createVector(-3.1389419, 20.898234, -100.123124);
	generateSpheres()
	frameRate(120);
	canvas = createCanvas(400, 400);
	background(10);
	lightVector = createVector(10 * Math.cos(frameCount / 10), -20, 10 * Math.sin(frameCount / 10))
	lightVector.normalize()
}

function draw() {
	lightVector = createVector(10 * Math.cos(frameCount / 10), -20, 10 * Math.sin(frameCount / 10))
	lightVector.normalize()
	background(0, 0, 0);
	noStroke();

	const cos = Math.cos(playerRotationY);
	const sin = Math.sin(playerRotationY);
	let yRotationMatrix = [
		[ cos, 0, -sin ],
		[ 0, 1, 0 ],
		[ sin, 0, cos ]
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
				[ uvVector.x, uvVector.y, uvVector.z ]
			]

			let matriceVector = multiplyMatrices(rayVectorMatrix, yRotationMatrix);
			let correctVector = createVector(matriceVector[ 0 ][ 0 ], matriceVector[ 0 ][ 1 ], matriceVector[ 0 ][ 2 ]);

			// Loop until we find the closest object, we get too far, or it's taking too long
			do {
				// Get the closest object distance
				let objectData = getSurfaceDistance(currentRayLocation, sphereArray);
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

			// Render shadows
			let maxShadewCircles = 0;
			let shadewRayLocation = currentRayLocation.copy()
			let shadewClosestObjectDistance = closestObjectDistance;
			let isShadewPixel = false;
			if (closestObjectDistance < hyperParameters.nearnessThreshold) {
				do {
					shadewClosestObjectDistance = getSurfaceDistance(shadewRayLocation, sphereArray.filter((object) => object != closestObject)).distance;
					shadewRayLocation.x += lightVector.x * shadewClosestObjectDistance;
					shadewRayLocation.y += lightVector.y * shadewClosestObjectDistance;
					shadewRayLocation.z += lightVector.z * shadewClosestObjectDistance;
					maxShadewCircles++
				} while (shadewClosestObjectDistance > 0.01 && shadewRayLocation.dist(playerLocation) < hyperParameters.maximumDistance && maxShadewCircles < hyperParameters.maximumLoopsPerRay);

				if (shadewClosestObjectDistance < 0.01) {
					isShadewPixel = true;
				}
			}

			// This is basically the fragment shader
			let fragmentColour = normalShadowShader(currentRayLocation, closestObjectEverDistance, closestObjectDistance, lightVector, closestObject, maxCircles, isShadewPixel);
			if (fragmentColour) {
				fill(fragmentColour.r, fragmentColour.g, fragmentColour.b);
				square(x - 1, y - 1, fragmentSize);
			}
		}
	}
	fill("white");
	text(frameRate(), 20, 20);
}