const cos = Math.cos(2);
const sin = Math.sin(2);
const matrix1 = [
    [cos, 0, -sin],
    [0, 1, 0],
    [sin, 0, cos]
]

const matrix2 = [
    [0.2400001, 0.1241148, 0.946645]
]

const multiplyMatrices = (a, b) => {
	let productRow = Array.apply(null, new Array(3)).map(Number.prototype.valueOf, 0);
	let product = new Array(1);
	product[0] = productRow.slice();
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			product[0][j] += a[0][k] * b[k][j];
		}
	}
	return product;
}

const multiplyMatrices2 = (a, b) => {
	let product = [[]];

	product[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0];
	product[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1];
	product[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2];

	return product;
}

console.time("multiplyMatrices");
for (let i = 0; i < 1000000; i++) {
    multiplyMatrices(matrix2, matrix1); // 433.1ms
}
console.timeEnd("multiplyMatrices");

console.time("multiplyMatrices2");
for (let i = 0; i < 1000000; i++) {
    multiplyMatrices2(matrix2, matrix1); // 62.8ms
}
console.timeEnd("multiplyMatrices2");