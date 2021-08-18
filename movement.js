function movePlayer() {
	// forward
	if (keyIsDown(87)) {
		let angle = radians(playerRotationY);
		let yRotationMatrix = [
			[Math.cos(angle), 0, -Math.sin(angle)],
			[0, 1, 0],
			[Math.sin(angle), 0, Math.cos(angle)]
		]
		let directionVectorMatrix = [
			[0, 0, 1]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, yRotationMatrix);
		playerLocation.add(createVector(rotatedDirectionVector[0][0], rotatedDirectionVector[0][1], rotatedDirectionVector[0][2]).normalize().mult(2))
	}
	// backwards
	if (keyIsDown(83)) {
		let angle = radians(playerRotationY);
		let yRotationMatrix = [
			[Math.cos(angle), 0, -Math.sin(angle)],
			[0, 1, 0],
			[Math.sin(angle), 0, Math.cos(angle)]
		]
		let directionVectorMatrix = [
			[0, 0, -1]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, yRotationMatrix);
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
		let angle = radians(playerRotationY);
		let yRotationMatrix = [
			[Math.cos(angle), 0, -Math.sin(angle)],
			[0, 1, 0],
			[Math.sin(angle), 0, Math.cos(angle)]
		]
		let directionVectorMatrix = [
			[-1, 0, 0]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, yRotationMatrix);
		playerLocation.add(createVector(rotatedDirectionVector[0][0], rotatedDirectionVector[0][1], rotatedDirectionVector[0][2]).normalize().mult(2))
	}
	// right
	if (keyIsDown(68)) {
		let angle = radians(playerRotationY);
		let yRotationMatrix = [
			[Math.cos(angle), 0, -Math.sin(angle)],
			[0, 1, 0],
			[Math.sin(angle), 0, Math.cos(angle)]
		]
		let directionVectorMatrix = [
			[1, 0, 0]
		]
		let rotatedDirectionVector = multiplyMatrices(directionVectorMatrix, yRotationMatrix);
		playerLocation.add(createVector(rotatedDirectionVector[0][0], rotatedDirectionVector[0][1], rotatedDirectionVector[0][2]).normalize().mult(2))
	}
    // rotate left
	if (keyIsDown(LEFT_ARROW)) {
		playerRotationY -= 3;
	}
    // rotate right
	if (keyIsDown(RIGHT_ARROW)) {
		playerRotationY += 3;
	}
}