class Shader {
    constructor(hasShadows) {
        this.hasShadows = hasShadows;
        // TODO: make these declared on construction
        this.parameters = {
            nearnessThreshold: 0.1,     
            maximumDistance: 1000,
            maximumLoopsPerRay: 500,
            normalEpsilon: 0.0000001,
            fadeDistanfeFromEdge: 300,
        };
        // TODO: make these declared on construction
        this.arguments = [currentRayLocation, closestObjectEverDistance, closestObjectDistance, lightVector, closestObject, maxCircles, isShadewPixel, shadewClosestObjectDistance];
        this.shade = 
    }
    shade() {

    }
}