let circleArray = [
	{
		x:0,
		y:0,
		r:300
	},
	{
		x:840,
		y:330,
		r:80
	},
	{
		x:350,
		y:600,
		r:60
	},
	{
		x:1250,
		y:400,
		r:120
	}
]

let directionVector = createVector(300, 400)
directionVector.normalize()

let locationVector = createVector(500, 600)




function setup() {
	frameRate(60)
	createCanvas(windowWidth, windowHeight);
	background(220);
}

function draw() {
	background(220);
	stroke('blue');
	let smallestLenght = distanceFromSurface({x: mouseX, y: mouseY}, circleArray[0]);
	for (circ of circleArray) {
		let distance = distanceFromSurface({x: mouseX, y: mouseY}, circ)
		if (distance < smallestLenght) smallestLenght = distance;
		circle(circ.x, circ.y, circ.r)
	}
	circle(mouseX, mouseY, smallestLenght)
}

function distanceFromSurface(point, passedCircle) {
	return Math.sqrt((point.x - passedCircle.x)**2 + (point.y - passedCircle.y)**2)*2 - passedCircle.r
}