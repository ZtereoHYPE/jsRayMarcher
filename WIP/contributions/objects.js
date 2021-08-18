const Type = {
    SPHERE: 1,
    PLANE:  2
}

class Shape {
    constructor(name, type, vec3, colour) {
        this.name = name;
        this.type = type;
        this.vec3 = vec3;
        this.colour = colour;
    }

    toString() {
        return this.type;
    }
}

class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString() {
        return "{" + x + "," + y + "," + z + "}"
    }
}