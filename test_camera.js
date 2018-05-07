var cubeVertexBuffer;
var cubeColorBuffer;
var cubeIndexBuffer;

var s = 0.3; //size of cube
var cubeVertices = new Float32Array([
    -s,-s,-s, s,-s,-s, s, s,-s, -s, s,-s,
    -s,-s, s, s,-s, s, s, s, s, -s, s, s,
    -s,-s,-s, -s, s,-s, -s, s, s, -s,-s, s,
    s,-s,-s, s, s,-s, s, s, s, s,-s, s,
    -s,-s,-s, -s,-s, s, s,-s, s, s,-s,-s,
    -s, s,-s, -s, s, s, s, s, s, s, s,-s,
]);

var cubeColors = new Float32Array([
    0,1,1, 0,1,1, 0,1,1, 0,1,1,
    1,0,1, 1,0,1, 1,0,1, 1,0,1,
    1,0,0, 1,0,0, 1,0,0, 1,0,0,
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    1,1,0, 1,1,0, 1,1,0, 1,1,0,
    0,1,0, 0,1,0, 0,1,0, 0,1,0
]);

var cubeIndices =  new Float32Array([
    0,1,2, 0,2,3,
    4,5,6, 4,6,7,
    8,9,10, 8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23
]);

var testSceneGraphRoot;

function initTestScene()
{
    let distance = 2;

    // init buffers
    cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    cubeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);

    cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    // build sceneGraph
    // testSceneGraphRoot = new SceneGraphNode();
    testSceneGraphRoot = new SceneGraphNode();

    var nodeA = new TransformationSceneGraphNode(makeTranslationMatrix(distance, 0, 0));
    nodeA.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeA);

    var nodeB = new TransformationSceneGraphNode(makeTranslationMatrix(-distance, 0, 0));
    nodeB.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeB);

    var nodeC = new TransformationSceneGraphNode(makeTranslationMatrix(0, distance, 0));
    nodeC.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);

    var nodeD = new TransformationSceneGraphNode(makeTranslationMatrix(0, -distance, 0));
    nodeD.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeD);

    var nodeE = new TransformationSceneGraphNode(makeTranslationMatrix(0, 0, distance));
    nodeE.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeE);

    var nodeF = new TransformationSceneGraphNode(makeTranslationMatrix(0, 0, -distance));
    nodeF.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeF);

    // register test-scene in the world
    world.setStaticScene(testSceneGraphRoot);

    // moveable object
    var track = new Track();
    track.addInterpolationPoint([-10, 0, -10], 0);
    track.addInterpolationPoint([10, 0, -10], 1e4);
    var node = new TrackObjectGraphNode(track);
    node.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));

    world.sceneNode.append(node);

    track.start();
}
function init1WorldScene()
{
    // build sceneGraph
    // testSceneGraphRoot = new SceneGraphNode();
    WorldSceneGraphRoot = new SceneGraphNode();

    //1 floor
    var floor = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0, 0, 0), makeScaleMatrix(16,0.5,8)));
    floor.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(floor);

    //2 left wall
    var nodeC = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0,0.5,-2.25), makeScaleMatrix(16,2,0.5)));
    nodeC.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);

    //3 right wall
    var nodeD = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0,0.5,2.25), makeScaleMatrix(16,2,0.5)));
    nodeD.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeD);
}

function init2WorldScene()
{
    // build sceneGraph
    // testSceneGraphRoot = new SceneGraphNode();
    WorldSceneGraphRoot = new SceneGraphNode();

    //1 floor
    var floor = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0, 0, 0), makeScaleMatrix(16,0.5,8)));
    floor.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(floor);

    // 2 window
    var nodeC = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(2.5,0.0,0), makeScaleMatrix(4,0.88,4)));
    nodeC.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);
}

function init3WorldScene()
{
    // build sceneGraph
    // testSceneGraphRoot = new SceneGraphNode();
    WorldSceneGraphRoot = new SceneGraphNode();

    // 1st step
    var floor = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(-3,0,0), makeScaleMatrix(2,2,8)));
    floor.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(floor);

    // 2nd step
    var nodeC = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(-2,-1,0), makeScaleMatrix(2,2,8)));
    nodeC.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);

    // 3rd step
    var nodeD = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(-1,-2,0), makeScaleMatrix(2,2,8)));
    nodeD.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeD);

    // 4th step
    var nodeE = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0,-3,0), makeScaleMatrix(2,2,8)));
    nodeE.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeE);

    // 5th step
    var nodeF = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(1,-4,0), makeScaleMatrix(2,2,8)));
    nodeF.append(new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeF);
}
