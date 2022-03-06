function getYRotationMatrix(angle) {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return [
		[cos, 0, -sin],
		[0, 1, 0],
		[sin, 0, cos]
	]
}

function movePlayer() {
	// forward
	if (keyIsDown(87)) {
		let directionVectorMatrix = [
			[0, 0, 1]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, getYRotationMatrix(playerRotationY));
		playerLocation.add(createVector(rotatedDirectionVector[0][0], rotatedDirectionVector[0][1], rotatedDirectionVector[0][2]).normalize().mult(2))
	}
	// backwards
	if (keyIsDown(83)) {
		let directionVectorMatrix = [
			[0, 0, -1]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, getYRotationMatrix(playerRotationY));
		playerLocation.add(createVector(rotatedDirectionVector[0][0], rotatedDirectionVector[0][1], rotatedDirectionVector[0][2]).normalize().mult(2))
	}
    // down
	if (keyIsDown(69)) {
		playerLocation.y -= 2
	}
    // up
	if (keyIsDown(81)) {
		playerLocation.y += 2
	}
	// left
	if (keyIsDown(65)) {
		let directionVectorMatrix = [
			[-1, 0, 0]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, getYRotationMatrix(playerRotationY));
		playerLocation.add(createVector(rotatedDirectionVector[0][0], rotatedDirectionVector[0][1], rotatedDirectionVector[0][2]).normalize().mult(2))
	}
	// right
	if (keyIsDown(68)) {
		let directionVectorMatrix = [
			[1, 0, 0]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, getYRotationMatrix(playerRotationY));
		playerLocation.add(createVector(rotatedDirectionVector[0][0], rotatedDirectionVector[0][1], rotatedDirectionVector[0][2]).normalize().mult(2))
	}
    // rotate left
	if (keyIsDown(LEFT_ARROW)) {
		playerRotationY -= 0.05;
	}
    // rotate right
	if (keyIsDown(RIGHT_ARROW)) {
		playerRotationY += 0.05;
	}
}