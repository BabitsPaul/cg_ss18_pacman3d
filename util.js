function makeCutoutSphere(latitudeBands, longitudeBands, angle) {
    var vertices = [];
    var normals = [];
    var texture = [];
    var index = [];

    // line along opening
    vertices.push(-1., 0., 0.);
    vertices.push(1., 0., 0.);
    vertices.concat(vertices);

    normals.push();

    return {
        position: vertices,
        normal: normals,
        texture: texture,
        index: index
    };
}

function clamp(val, lower, upper)
{
    if(val < lower)
        return lower;

    if(val > upper)
        return upper;

    return val;
}
