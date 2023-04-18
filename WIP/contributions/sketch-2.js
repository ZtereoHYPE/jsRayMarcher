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
let fragmentSize = 3;
let playerLocation;
let lightVector
let maxCircles
function setup() {
	playerLocation = createVector(0, 0, -100);
	generateSpheres()
	frameRate(60)
	canvas = createCanvas(300, 300);
	background(10);
	for (let y = 1; y <= canvas.height; y += fragmentSize) {
		for (let x = 1; x <= canvas.width; x += fragmentSize) {
			let u = x / (canvas.width / 2) - 1;
			let v = y / (canvas.height / 2) - 1;
			vectorArray.push([createVector(u, v, 1).normalize(), {x: x, y: y}])
		}
	}
	lightVector = createVector(10 * Math.cos(frameCount), -10, -10)
	lightVector.normalize()
}

function draw() {
	lightVector = createVector(10 * Math.cos(frameCount/10), -20, 10 * Math.sin(frameCount/10))
	lightVector.normalize()
	movePlayer()
	background(10);
	fill("white")
	// This is the vector generator and the caster at the same time, 
	// maybe the rays could be cached on startup since there is no rotation, 
	// and recalculated at rotation.

	// i really need more performance lol
	for (let y = 1; y <= canvas.height; y += fragmentSize) {
		for (let x = 1; x <= canvas.width; x += fragmentSize) {
			let u = x / (canvas.width / 2) - 1;
			let v = y / (canvas.height / 2) - 1;
			
			let smallestSphereDistance = Infinity;
			let currentRayLocation = playerLocation.copy()
			let chosenSphere;
			
			maxCircles = 0;
			while (smallestSphereDistance > 0.0001 && maxCircles < 60 && (currentRayLocation.z - playerLocation.z) < 300 && (currentRayLocation.x - playerLocation.x) < 300 && (currentRayLocation.y - playerLocation.y) < 300) {

				for (sphere of sphereArray) {
					let distance = currentRayLocation.dist(sphere.vect) - sphere.r
					if (distance < smallestSphereDistance) {
						smallestSphereDistance = distance;
						chosenSphere = sphere;
					};
				}
				
				// let surfaceData = getSurfaceDistance(currentRayLocation)
				// chosenSphere = surfaceData[1]

				currentRayLocation.add(createVector(u,v,1).normalize().mult(smallestSphereDistance))
				// if (currentRayLocation.x > 100) currentRayLocation.x -= 100
				// if (currentRayLocation.y > 100) currentRayLocation.y -= 100
				// if (currentRayLocation.z > 100) currentRayLocation.z -= 100
				// if (currentRayLocation.x < 0) currentRayLocation.x += 100
				// if (currentRayLocation.y < 0) currentRayLocation.y += 100
				// if (currentRayLocation.z < 0) currentRayLocation.z += 100
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
				square(x, y, fragmentSize)
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