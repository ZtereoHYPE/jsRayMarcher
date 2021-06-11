let generatorArray = [
	{
		x: 0,
		y: 0,
		r: 300
	},
	{
		x: 840,
		y: 330,
		r: 80
	},
	{
		x: 350,
		y: 600,
		r: 60
	},
	{
		x: 1250,
		y: 400,
		r: 120
	}
]
let circleArray = []
let directionVector;
let locationVector;
function setup() {
	for (circ of generatorArray) {
		circleArray.push({ vect: createVector(circ.x, circ.y), r: circ.r })
	}
	frameRate(60)
	createCanvas(windowWidth, windowHeight);
	background(220);
	directionVector = createVector(-80, -100)
	directionVector.normalize()

	locationVector = createVector(500, 600)
}

function draw() {
	directionVector.x = mouseX - locationVector.x
	directionVector.y = mouseY - locationVector.y
	directionVector.normalize()
	background(220);
	stroke('blue');
	fill('white')
	for (circ of circleArray) {
		circle(circ.vect.x, circ.vect.y, circ.r * 2)
	}

	let max = 0;
	let currentDistance = Infinity;
	let currentLocation = locationVector.copy()
	while (currentDistance > 0.0001 && max < 20) {
		currentDistance = currentLocation.dist(circleArray[0].vect)
		for (circ of circleArray) {
			// console.log(max, currentLocation, circ.vect, currentLocation.dist(circ.vect) - circ.r)
			let distance = currentLocation.dist(circ.vect) - circ.r
			if (distance < currentDistance) currentDistance = distance;
		}

		noFill()
		circle(currentLocation.x, currentLocation.y, currentDistance * 2)
		currentLocation.add(directionVector.copy().mult(currentDistance))
		max++
	}

	line(locationVector.x, locationVector.y, currentLocation.x, currentLocation.y)
	noStroke()
	fill('green')
	circle(locationVector.x, locationVector.y, 30)
	fill('red')
	circle(currentLocation.x, currentLocation.y, 20)
	movePlayer();
}

function movePlayer() {
	// up
	if (keyIsDown(87)) {
		locationVector.y -= 2
	}

	// down
	if (keyIsDown(83)) {
		locationVector.y += 2
	}

	// left
	if (keyIsDown(65)) {
		locationVector.x -= 2
	}

	// right
	if (keyIsDown(68)) {
		locationVector.x += 2
	}
}