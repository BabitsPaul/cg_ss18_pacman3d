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

    cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    cubeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);

    cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

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

    // TODO temporary fix to draw testscene
    world.sceneNode.append(testSceneGraphRoot);
}