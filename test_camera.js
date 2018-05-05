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
    var cubeRenderNode = new ObjectSceneGraphNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer);

    var nodeA = new TransformationSceneGraphNode(makeTranslationMatrix(distance, 0, 0));
    nodeA.append(cubeRenderNode);
    testSceneGraphRoot.append(nodeA);

    var nodeB = new TransformationSceneGraphNode(makeTranslationMatrix(distance, 0, 0));
    nodeB.append(cubeRenderNode);
    testSceneGraphRoot.append(nodeB);

    var nodeC = new TransformationSceneGraphNode(makeTranslationMatrix(distance, 0, 0));
    nodeC.append(cubeRenderNode);
    testSceneGraphRoot.append(nodeC);

    var nodeD = new TransformationSceneGraphNode(makeTranslationMatrix(distance, 0, 0));
    nodeD.append(cubeRenderNode);
    testSceneGraphRoot.append(nodeD);

    var nodeE = new TransformationSceneGraphNode(makeTranslationMatrix(distance, 0, 0));
    nodeE.append(cubeRenderNode);
    testSceneGraphRoot.append(nodeE);

    var nodeE = new TransformationSceneGraphNode(makeTranslationMatrix(distance, 0, 0));
    nodeA.append(cubeRenderNode);
    testSceneGraphRoot.append(nodeE);
}

function renderTestScene()
{
    // TODO replace by scene-graph rendering
    let distance = 2;

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false,0,0) ;
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false,0,0) ;
    gl.enableVertexAttribArray(colorLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);


    let sceneMatrixBackup = camera.sceneMatrix;

    camera.sceneMatrix = matrixMultiply(sceneMatrixBackup, makeTranslationMatrix(0, distance, 0));
    camera.writeModelViewMatrix();
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0); //LINE_STRIP

    camera.sceneMatrix = matrixMultiply(sceneMatrixBackup, makeTranslationMatrix(0, -distance, 0));
    camera.writeModelViewMatrix();
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0); //LINE_STRIP

    camera.sceneMatrix = matrixMultiply(sceneMatrixBackup, makeTranslationMatrix(distance, 0, 0));
    camera.writeModelViewMatrix();
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0); //LINE_STRIP

    camera.sceneMatrix = matrixMultiply(sceneMatrixBackup, makeTranslationMatrix(-distance, 0, 0));
    camera.writeModelViewMatrix();
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0); //LINE_STRIP

    camera.sceneMatrix = matrixMultiply(sceneMatrixBackup, makeTranslationMatrix(0, 0, distance));
    camera.writeModelViewMatrix();
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0); //LINE_STRIP

    camera.sceneMatrix = matrixMultiply(sceneMatrixBackup, makeTranslationMatrix(0, 0, -distance));
    camera.writeModelViewMatrix();
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0); //LINE_STRIP

    camera.sceneMatrix = sceneMatrixBackup;
}
