let worldConfig = {
    // overall world
    width : 5,
    length : 100,
    height : 10,

    // scene 1
    scene1Length : 50,

    // scene 2
    stairHeight : 8,
    stairSteps : 8,
    stairLength : 8,

    // scene 3
    gridWidth : 5,
    gridLength : 5,
    gridBarsX : 8,
    gridBarsY : 8,
    gridBarWidth : .5,
    gridStairOffset : 5
};

function initStaticScene(resources)
{
    var sceneInternal = sg.root();

    // all walls and floor should be of the same material
    let scene = new MaterialSGNode(
          new SetUniformSGNode("u_enableObjectTexture", false,
              sceneInternal
          )
    );

    // wall
    let wall =
        sg.translate(0, 0, worldConfig.width,
            sg.scale(worldConfig.length, worldConfig.height, .5,
                sg.drawCube()
            )
        );
    sceneInternal.append(wall);

    // floor (scene 1)
    var stairOffsetY = (worldConfig.height - worldConfig.stairHeight) / 2;

    let floorS1 =
        sg.translate(0, stairOffsetY + worldConfig.stairHeight, worldConfig.width / 2,
            sg.scale(worldConfig.scene1Length, 1, worldConfig.width,
                sg.drawCube()
            )
        );
    sceneInternal.append(floorS1);

    // stairs (scene 2)
    var stepHeight = worldConfig.stairHeight / worldConfig.stairSteps;
    var stepLength = worldConfig.stairLength / worldConfig.stairSteps;

    for(var i = 0; i < worldConfig.stairSteps; i++)
    {
        var offsetX = worldConfig.stairLength / worldConfig.stairSteps * i;
        var offsetY = worldConfig.stairHeight / worldConfig.stairSteps * i;

        let step =
            sg.translate(worldConfig.scene1Length + offsetX, stairOffsetY + offsetY, worldConfig.width / 2,
                sg.scale(stepLength, stepHeight, worldConfig.width,
                    sg.drawCube()
                )
            );

        sceneInternal.append(step);
    }

    // grid
    var gridDistanceX = worldConfig.gridWidth / worldConfig.gridBarWidth;
    var gridDistanceY = worldConfig.gridLength / worldConfig.gridBarWidth;
    var gridOffsetX = worldConfig.scene1Length + worldConfig.stairLength + worldConfig.gridStairOffset;

    world.setStaticScene(scene);
}

function initScene1()
{
    let scene = new Scene(0, 0, 0, 5, 5, 5);

    let track = new Track();
    track.addInterpolationPoint([-10, 0, -10], 0);
    track.addInterpolationPoint([10, 0, -10], 1e4);

    let obj = new SceneObject(track, sg.drawCube());
    scene.addObject(obj);

    scene.cameraOrientationTrack = new Track();
    scene.cameraOrientationTrack.addInterpolationPoint([0, -1, 1], 0);
    scene.cameraOrientationTrack.addInterpolationPoint([0, 0, 1], 1e4);

    scene.cameraLocationTrack = new Track();
    scene.cameraLocationTrack.addInterpolationPoint([0, 0, 5], 0);
    scene.cameraLocationTrack.addInterpolationPoint([0, 0, 10], 1e4);

    world.addScene(scene);
}
