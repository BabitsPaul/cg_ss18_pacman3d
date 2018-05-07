//the OpenGL context
var gl = null;
//our shader program
var shaderProgram = null;

var canvasWidth = 800;
var canvasHeight = 800;
var aspectRatio = canvasWidth / canvasHeight;

var modelViewLocation;
var positionLocation;
var colorLocation;
var projectionLocation;

// scene graph-context


//load the shader resources using a utility function
loadResources({
    vs: 'shader/simple.vs.glsl',
    fs: 'shader/simple.fs.glsl'
}).then(function (resources /*an object containing our keys with the loaded resources*/) {
    init(resources);

    //render one frame
    requestAnimationFrame(render);
});

/**
 * Render-stub handles requestAnimationFrame. Otherwise rendering is handled
 * by the node/the scenegraph.
 *
 * @param dt time passed since last frame in ms
 */
function render(dt)
{
    world.render(dt);

    requestAnimationFrame(render);
}

var world = {
    sg_context : {
        gl: gl,
        sceneMatrix: mat4.create(),
        viewMatrix: calculateViewMatrix(),
        projectionMatrix: null,
        shader: null
    },

    rootNode : new SceneGraphRootNode(),
    staticSceneNode : new SceneGraphNode(),
    sceneNode :  new SceneGraphNode(),

    init() {
        // build basis of scene-graph
        this.rootNode.append(this.staticSceneNode);
        this.rootNode.append(this.sceneNode);

        // init scenegraph-context
        this.sg_context.gl = gl;
        this.sg_context.shader = shaderProgram;
    },

    render(timeInMillis)
    {
        console.log("new frame");

        clock.update(timeInMillis);

        // setup for new frame
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // clear buffer
        gl.enable(gl.DEPTH_TEST);                               // enable depth-test

        // render scene
        this.rootNode.render(this.sg_context);                  // render scene
    },

    setStaticScene(sgRoot)
    {
        // remove old staticScene
        this.staticSceneNode.children = [];

        // set new static scene
        this.staticSceneNode.append(sgRoot);
    }
};

/**
 * initializes OpenGL context, compile shader, get position of uniforms and
 * attributes and initializes components of the program
 */
function init(resources)
{
    //create a GL context
    gl = createContext(canvasWidth, canvasHeight);

    //in WebGL / OpenGL3 we have to create and use our own shaders for the programmable pipeline
    //create the shader program
    shaderProgram = createProgram(gl, resources.vs, resources.fs);

    // shader-locations
    modelViewLocation = gl.getUniformLocation(shaderProgram, 'u_modelView');
    projectionLocation = gl.getUniformLocation(shaderProgram, 'u_projection');
    positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    colorLocation = gl.getAttribLocation(shaderProgram, "a_color");

    // initialization of components
    camera.init();
    clock.init();
    world.init();

    // initialization of scenes
    initTestScene();
    init1WorldScene();
    init2WorldScene();
    init3WorldScene();
}
