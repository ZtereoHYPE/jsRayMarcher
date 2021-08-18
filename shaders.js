function normalVoidlessShader(currentRayLocation) {
	let normal = getSurfaceNormal(currentRayLocation);

	gl_FragColor = {
		r: (normal.x * 0.5 + 0.5) * 255,
		g: (normal.y * 0.5 + 0.5) * 255,
		b: (normal.z * 0.5 + 0.5) * 255
	}
	return gl_FragColor;
}

function normalFragmentShader(currentRayLocation, closestObjectEverDistance, closestObjectDistance) {
	let normal = getSurfaceNormal(currentRayLocation);
    if (closestObjectDistance > 0.1) return;
	gl_FragColor = {
		r: (normal.x * 0.5 + 0.5) * 255,
		g: (normal.y * 0.5 + 0.5) * 255,
		b: (normal.z * 0.5 + 0.5) * 255
	}
	return gl_FragColor;
}

// inspired from shaduwu uwu
function cycleCounterShader(currentRayLocation, closestObjectEverDistance, closestObjectDistance, lightVector, closestObject, maxCircles) {
    let multiplier = 255/hyperParameters.maximumLoopsPerRay;
    let augmentedValue = maxCircles * multiplier;
	gl_FragColor = {
		r: augmentedValue,
		g: augmentedValue,
		b: augmentedValue
	}
	return gl_FragColor;
}

function colourFragmentShader(currentRayLocation, closestObjectEverDistance, closestObjectDistance, lightVector, closestObject) {
	// Fog shader
	let darkFadeFactor;
	let playerDistanceFromObject = currentRayLocation.dist(playerLocation);
	let fogStart = hyperParameters.maximumDistance - hyperParameters.fadeDistanfeFromEdge;
	if (playerDistanceFromObject >= fogStart) {
		darkFadeFactor = (hyperParameters.maximumDistance - playerDistanceFromObject) / hyperParameters.fadeDistanfeFromEdge;
	} else {
		darkFadeFactor = 1;
	}

	// Coloured shader (with fog)
	let normal = getSurfaceNormal(currentRayLocation);
	let brightness = p5.Vector.dot(normal, lightVector);
	let minimumBrightness = 0.2;
	let r = closestObject.colour[0];
	let g = closestObject.colour[1];
	let b = closestObject.colour[2];

	gl_FragColor = {
		r: max(minimumBrightness * r, brightness * r) * darkFadeFactor,
		g: max(minimumBrightness * g, brightness * g) * darkFadeFactor,
		b: max(minimumBrightness * b, brightness * b) * darkFadeFactor
	}

	return gl_FragColor;
}

function glowPlanetsShader(currentRayLocation, closestObjectEverDistance) {
	gl_FragColor = {
		r: 250 / (Math.sqrt(closestObjectEverDistance)**1.4),
		g: 250 / (closestObjectEverDistance),
		b: 60 / (closestObjectEverDistance ** 2)
	}
	return gl_FragColor;
}