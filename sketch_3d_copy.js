//this implementation cached the vectors on startup. it is bad.

let generatorArray = [
	{
		x: -20,
		y: 0,
		z: 10,
		r: 30,
		c: [255, 128, 0]
	},
	{
		x: 50,
		y: 0,
		z: 80,
		r: 30,
		c: [0, 40, 200]
	}
]
let sphereArray = [];
function generateSpheres() {
	for (circ of generatorArray) {
		sphereArray.push({ vect: createVector(circ.x, circ.y, circ.z), r: circ.r, c: circ.c })
	}
}

let canvas;
let vectorArray = [];
let fragmentSize = 2;
let playerLocation;
let lightVector
let maxCircles
function setup() {
	playerLocation = createVector(0, 0, -100);
	generateSpheres()
	frameRate(20)
	canvas = createCanvas(300, 300);
	background(10);
	for (let y = 1; y <= canvas.height; y += fragmentSize) {
		for (let x = 1; x <= canvas.width; x += fragmentSize) {
			let u = x / (canvas.width / 2) - 1;
			let v = y / (canvas.height / 2) - 1;
			vectorArray.push([createVector(u, v, 1).normalize(), {x: x, y: y}])
		}
	}
}

function draw() {
	lightVector = createVector(10 * Math.cos(frameCount/10), -20, 10 * Math.sin(frameCount/10))
	lightVector.normalize()
	movePlayer()
	background(10);
	fill("white")
	text(frameRate(), 20, 20)

		for (vectorObject of vectorArray) {
			let smallestSphereDistance = Infinity;
			let currentRayLocation = playerLocation.copy()
			let chosenSphere;
			
			maxCircles = 0;
			while (smallestSphereDistance > 0.0001 && maxCircles < 30) {

				for (sphere of sphereArray) {
					let distance = currentRayLocation.dist(sphere.vect) - sphere.r
					if (distance < smallestSphereDistance) {
						smallestSphereDistance = distance;
						chosenSphere = sphere;
					};
				}
				
				// let surfaceData = getSurfaceDistance(currentRayLocation)
				// chosenSphere = surfaceData[1]

				currentRayLocation.add(vectorObject[0].copy().mult(smallestSphereDistance))
				maxCircles++
			}

			if (smallestSphereDistance < 0.1) {
				let normal = getSurfaceNormal(currentRayLocation)
				let brightness = p5.Vector.dot(normal, lightVector)
				noStroke()
				let r = chosenSphere.c[0]
				let g = chosenSphere.c[1]
				let b = chosenSphere.c[2]
				// fill(normal.x * 255, normal.y * 255,normal.z * 255)
				fill(max(0.1 * r, brightness * r), max(0.1 * g, brightness * g), max(0.1 * b, brightness * b))
				square(vectorObject[1].x, vectorObject[1].y, fragmentSize)
			}
		}
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

	// left
	if (keyIsDown(65)) {
		playerLocation.x -= 2
	}

	// right
	if (keyIsDown(68)) {
		playerLocation.x += 2
	}
}

// Samples the surface distance at 4 points: pos, pos with a small x offset, pos with a small y offset and pos with a small z offset and uses the distance differences to estimate the surface normal.
function getSurfaceNormal(pos) {
	const epsilon = 0.001;
	const centerDistance = getSurfaceDistance(pos)[0];
	const xDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(epsilon, 0, 0)))[0];
	const yDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(0, epsilon, 0)))[0];
	const zDistance = getSurfaceDistance(p5.Vector.add(pos, createVector(0, 0, epsilon)))[0];
	let normal = createVector(xDistance - centerDistance, yDistance - centerDistance, zDistance - centerDistance);
	normal.normalize();
	
	return normal;
}

function getSurfaceDistance(pos) {
	let smallestSphereDistance = Infinity;
	let closestSphere;

	for (sphere of sphereArray) {
		let distance = pos.dist(sphere.vect) - sphere.r
		if (distance < smallestSphereDistance) {
			smallestSphereDistance = distance;
			closestSphere = sphere;
		};
	}
	return [smallestSphereDistance, closestSphere];
}