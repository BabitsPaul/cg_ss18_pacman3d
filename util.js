
// Helper function taken from webglfundamentals.org tutorials
// Note that OpenGL expects the transposed matrix (when compared to slide)
function makeTranslationMatrix(tx, ty, tz) {
    return [
        1,  0,  0,  0,
        0,  1,  0,  0,
        0,  0,  1,  0,
        tx, ty, tz, 1
    ];
}

// Helper function taken from webglfundamentals.org tutorials
// Note that OpenGL expects the transposed matrix (when compared to slide)
function makeYRotationMatrix(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ];
};

// Helper function taken from webglfundamentals.org tutorials
// Note that OpenGL expects the transposed matrix (when compared to slide)
function makeScaleMatrix(sx, sy, sz) {
    return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1
    ];
}

// Helper function taken from webglfundamentals.org tutorials
// Note that OpenGL expects the transposed matrix (when compared to slide)
var matrixMultiply = function(b,a) {
    var a00 = a[0*4+0];
    var a01 = a[0*4+1];
    var a02 = a[0*4+2];
    var a03 = a[0*4+3];
    var a10 = a[1*4+0];
    var a11 = a[1*4+1];
    var a12 = a[1*4+2];
    var a13 = a[1*4+3];
    var a20 = a[2*4+0];
    var a21 = a[2*4+1];
    var a22 = a[2*4+2];
    var a23 = a[2*4+3];
    var a30 = a[3*4+0];
    var a31 = a[3*4+1];
    var a32 = a[3*4+2];
    var a33 = a[3*4+3];
    var b00 = b[0*4+0];
    var b01 = b[0*4+1];
    var b02 = b[0*4+2];
    var b03 = b[0*4+3];
    var b10 = b[1*4+0];
    var b11 = b[1*4+1];
    var b12 = b[1*4+2];
    var b13 = b[1*4+3];
    var b20 = b[2*4+0];
    var b21 = b[2*4+1];
    var b22 = b[2*4+2];
    var b23 = b[2*4+3];
    var b30 = b[3*4+0];
    var b31 = b[3*4+1];
    var b32 = b[3*4+2];
    var b33 = b[3*4+3];
    return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
        a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
        a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
        a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
        a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
        a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
        a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
        a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
        a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
        a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
        a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
        a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
        a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
        a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
        a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
        a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
};

function convertDegreeToRadians(degree) {
    return degree * Math.PI / 180
}

function makeCutoutSphere(radius, latitudeBands, longitudeBands, angle) {
    radius = radius || 2;
    latitudeBands = latitudeBands || 30;
    longitudeBands = longitudeBands || 30;

    //based on view-source:http://learningwebgl.com/lessons/lesson11/index.html
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands * (angle / (2 * Math.PI));
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);
            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            textureCoordData.push(u);
            textureCoordData.push(v);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }

    var indexData = [];

    // prepend connections for mouth
    for(var l = 1; l < longitudeBands - 1; l++)
    {
        indexData.push(0);
        indexData.push(l);
        indexData.push(l + 1);
    }

    // data for sphere
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);
            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }

    // append connections for the mouth
    var offset = (latitudeBands - 1) * longitudeBands;

    for(var l = offset + 1; l < offset + longitudeBands - 1; l++)
    {
        indexData.push(offset);
        indexData.push(l);
        indexData.push(l + 1);
    }

    // color-buffer (TODO temporary)
    var colorData = [];

    for(var l = 0; l < latitudeBands * longitudeBands; l++)
        colorData.push(0xFF, 0xFF, 0x00);

    return {
        position: vertexPositionData,
        normal: normalData,
        texture: textureCoordData,
        index: indexData, //1
        color: colorData
    };
}