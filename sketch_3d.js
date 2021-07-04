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
			y: -1,
			z: 0
		},
		point: {
			x: 0,
			y: 100,
			x: 0
		},
		colour: [255, 255, 255]
	},
]
let sphereArray = [];
function generateSpheres() {
	for (circ of generatorArray) {
		if (circ.type === "sphere") {
			sphereArray.push({
				vect: createVector(circ.x, circ.y, circ.z),
				r: circ.r,
				colour: circ.colour,
				type: circ.type
			})
		} else if (circ.type === "plane") {
			sphereArray.push({
				normal: createVector(circ.normal.x, circ.normal.y, circ.normal.z).normalize(),
				point: createVector(circ.point.x, circ.point.y, circ.point.z),
				colour: circ.colour,
				type: circ.type
			})
		}
	}
}

let canvas;
let vectorArray = [];
let fragmentSize = 4;
let playerLocation;
let playerRotationY = 0;
let lightVector
let maxCircles
function setup() {
	playerLocation = createVector(0, 0, -100);
	generateSpheres()
	frameRate(10)
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

			maxCircles = 0;
			while (smallestSphereDistance > 0.01  && (currentRayLocation.z - playerLocation.z) < 300 && (currentRayLocation.x - playerLocation.x) < 300 && (currentRayLocation.y - playerLocation.y) < 300) {
				for (sphere of sphereArray) {
					if (sphere.type === "sphere") {
						let distance = Math.abs(currentRayLocation.dist(sphere.vect) - sphere.r)
						if (distance < smallestSphereDistance) {
							smallestSphereDistance = distance;
							chosenSphere = sphere;
						};
					} 
					else if (sphere.type === "plane") {
						let distance = Math.abs(p5.Vector.dot(sphere.normal, p5.Vector.sub(currentRayLocation, sphere.point)));
						if (distance < smallestSphereDistance) {
							smallestSphereDistance = distance;
							chosenSphere = sphere;
						};
					}
				}

				// let surfaceData = getSurfaceDistance(currentRayLocation)
				// chosenSphere = surfaceData[1]
				let correctVector = createVector(u, v, 1).normalize();
				let rotatedVector = createVector(correctVector.x, correctVector.y).rotate(radians(playerRotationY))
				currentRayLocation.add(createVector(rotatedVector.x * smallestSphereDistance, rotatedVector.y * smallestSphereDistance, correctVector.z * smallestSphereDistance))
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
		playerRotationY += 4
	}

	if (keyIsDown(RIGHT_ARROW)) {
		playerRotationY -= 4
	}
}

// Samples the surface distance at 4 points: pos, pos with a small x offset, pos with a small y offset and pos with a small z offset and uses the distance differences to estimate the surface normal.
function getSurfaceNormal(pos) {
	const epsilon = 0.0001;
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
		if (sphere.type === "sphere") {
			let distance = pos.dist(sphere.vect) - sphere.r
			if (distance < smallestSphereDistance) {
				smallestSphereDistance = distance;
				closestSphere = sphere;
			};
		} 
		else if (sphere.type === "plane") {
			let distance = Math.abs(p5.Vector.dot(sphere.normal, p5.Vector.sub(pos, sphere.point)));	
			if (distance < smallestSphereDistance) {
				smallestSphereDistance = distance;
				chosenSphere = sphere;
			};
		}
	}
	return [smallestSphereDistance, closestSphere];
}