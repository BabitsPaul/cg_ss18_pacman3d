let s = 0.3; //size of cube

let testSceneGraphRoot;

function initStaticScene(resources)
{
    let distance = 2;

    // build sceneGraph
    // testSceneGraphRoot = new SceneGraphNode();
    testSceneGraphRoot = sg.root();

    /*
    let nodeA = sg.translate(distance, 0, 0);
    nodeA.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeA);

    let nodeB = sg.translate(-distance, 0, 0);
    nodeB.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeB);

    let nodeC = sg.translate(0, distance, 0);
    nodeC.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);

    let nodeD = sg.translate(0, -distance, 0);
    nodeD.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeD);

    let nodeE = sg.translate(0, 0, distance);
    nodeE.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeE);

    let nodeF = sg.translate(0, 0, -distance);
    nodeF.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeF);
    */

    testSceneGraphRoot.append(
        new SetUniformSGNode("u_enableObjectTexture", true,
            new AdvancedTextureSGNode(resources.lava,
                sg.drawSphere(2, 100, 100)
            )
        )
    );

    /*
    // sphere
    var sphere = makeCutoutSphere(2, 100, 100, Math.PI * 1.5);

    var sphereVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.position, gl.STATIC_DRAW);

    var sphereColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.color, gl.STATIC_DRAW);

    var sphereIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereIndexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sphere.index, gl.STATIC_DRAW);

    testSceneGraphRoot.append(new ObjectSGNode(100 * 100, sphereVertexBuffer, sphereColorBuffer, sphereIndexBuffer));
    */

    // init1WorldScene();
    // init2WorldScene();
    // init3WorldScene();

    // register test-scene in the world
    world.setStaticScene(testSceneGraphRoot);
}

function init1WorldScene()
{
    // build sceneGraph
    //1 floor
    var floor = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0, 0, 0), makeScaleMatrix(16,0.5,8)));
    floor.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(floor);

    //2 left wall
    var nodeC = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0,0.5,-2.25), makeScaleMatrix(16,2,0.5)));
    nodeC.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);

    //3 right wall
    var nodeD = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0,0.5,2.25), makeScaleMatrix(16,2,0.5)));
    nodeD.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeD);
}

function init2WorldScene()
{
    // 1 floor
    var floor = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0+10, 0, 0), makeScaleMatrix(20,0.5,8)));
    floor.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(floor);

    // 2 window
    var nodeC = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(2.5+11,0.0,0), makeScaleMatrix(4,0.88,4)));
    nodeC.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);
}

function init3WorldScene()
{
    // 1st step
    var floor = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(-3+14,-1,0), makeScaleMatrix(2,2,8)));
    floor.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(floor);

    // 2nd step
    var nodeC = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(-2+14,-2,0), makeScaleMatrix(2,2,8)));
    nodeC.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeC);

    // 3rd step
    var nodeD = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(-1+14,-3,0), makeScaleMatrix(2,2,8)));
    nodeD.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeD);

    // 4th step
    var nodeE = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(0+14,-4,0), makeScaleMatrix(2,2,8)));
    nodeE.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeE);

    // 5th step
    var nodeF = new TransformationSceneGraphNode(matrixMultiply(makeTranslationMatrix(1+14,-5,0), makeScaleMatrix(2,2,8)));
    nodeF.append(new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    testSceneGraphRoot.append(nodeF);
}

function initScene1()
{
    /*
    let scene = new Scene(0, 0, 0, 5, 5, 5);

    let track = new Track();
    track.addInterpolationPoint([-10, 0, -10], 0);
    track.addInterpolationPoint([10, 0, -10], 1e4);

    let obj = new SceneObject(track, new ObjectSGNode(cubeIndices.length, cubeVertexBuffer, cubeColorBuffer, cubeIndexBuffer));
    scene.addObject(obj);

    scene.cameraOrientationTrack = new Track();
    scene.cameraOrientationTrack.addInterpolationPoint([0, -1, 1], 0);
    scene.cameraOrientationTrack.addInterpolationPoint([0, 0, 1], 1e4);

    scene.cameraLocationTrack = new Track();
    scene.cameraLocationTrack.addInterpolationPoint([0, 0, 5], 0);
    scene.cameraLocationTrack.addInterpolationPoint([0, 0, 10], 1e4);

    world.addScene(scene);
    */
}
