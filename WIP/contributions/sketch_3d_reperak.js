let generatorArray = [
	new Shape("sphere1", Type.SPHERE, new Vec3(-30, 30, 10), [255, 255, 255]),
	new Shape("sphere2", Type.SPHERE, new Vec3(50, 0, 80), [255, 255, 255]),
	new Shape("plane", Type.PLANE, new Vec3(0, 1, 0), [255, 255, 255])
]
let sphereArray = [];
function generateSpheres() {
	for (circ of generatorArray) {
		if (circ.type === Type.SPHERE) {
			sphereArray.push({
				vect: createVector(circ.x, circ.y, circ.z),
				r: circ.r,
				colour: circ.colour,
				type: circ.type
			})
		} else if (circ.type === "plane") {
		}

		switch (circ.type) {
			case Type.SPHERE:
				console.log("bb")
				sphereArray.push({
					vect: createVector(circ.x, circ.y, circ.z),
					r: circ.r,
					colour: circ.colour,
					type: circ.type
				})
				break;

			case Type.PLANE:
				console.log("hh")
				sphereArray.push({
					normal: createVector(circ.normal.x, circ.normal.y, circ.normal.z).normalize(),
					point: createVector(circ.point.x, circ.point.y, circ.point.z),
					colour: circ.colour,
					type: circ.type
				})
				break;
		}

		console.log(sphereArray);
	}
}

let canvas;
let vectorArray = [];
let fragmentSize = 6;
let playerLocation;
let playerRotationY = 0;
let playerRotationX = 0;
let lightVector;
let maxCircles;
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

			maxCircles = 0;
			while (smallestSphereDistance > 0.1 && currentRayLocation.dist(playerLocation) < 500) {
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

				// matriceVector = multiplyMatrices(matriceVector, XtranformationMatrix);
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
				// fill((normal.x*0.5 +0.5) * 255, (normal.y*0.5 +0.5) * 255, (normal.z*0.5 +0.5) * 255)
				fill(max(0.2 * r, brightness * r), max(0.2 * g, brightness * g), max(0.2 * b, brightness * b))
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
		console.log("angle " + playerRotationY);
	}

	if (keyIsDown(RIGHT_ARROW)) {
		playerRotationY += 1;
		console.log("angle " + playerRotationY);
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

const multiplyMatrices = (a, b) => {
	// if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
	// 	throw new Error('arguments should be in 2-dimensional array format');
	// }
	let x = a.length,
		z = a[0].length,
		y = b[0].length;
	// if (b.length !== z) {
	// 	// XxZ & ZxY => XxY
	// 	throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
	// }
	let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
	let product = new Array(x);
	for (let p = 0; p < x; p++) {
		product[p] = productRow.slice();
	}
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			for (let k = 0; k < z; k++) {
				product[i][j] += a[i][k] * b[k][j];
			}
		}
	}
	return product;
}
