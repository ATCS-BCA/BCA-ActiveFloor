function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}

function inRange (xPos, yPos, xMin, xMax, yMin, yMax) {
    return (xPos >= xMin && xPos <= xMax && yPos >= yMin && yPos <= yMax)
}

function lerp(a, b, n) {
    return n * (b - a) + a;
}

// Cubic
function easeIn(a, b, n) {
    return (n * n * n) * (b - a) + a;
}

// Cubic
function easeOut(a, b, n) {
    return ((--n) * n * n + 1) * (b - a) + a;
}

// Quadratic
function easeInOut(a, b, n) {
    return (n < 0.5) ? (2 * n * n) * (b - a) + a : (-1 + (4 - 2 * n) * n) * (b - a) + a;
}

function cosineInterpolation(a, b, n) {
    return (-0.5 * Math.cos(3 * Math.PI * n) + 0.5) * (b - a) + a;
}

function circInterpolation(a, b, n) {
    return Math.sqrt(1 - (n - 1) * (n - 1)) * (b - a) + a;
}

// Cubic
function polynomialInterpolation(a, b, n) {
    return ((8 * n * n * n) - (12 * n * n) + (5 * n)) * (b - a) + a;
}