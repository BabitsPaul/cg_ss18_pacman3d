//the OpenGL context
var gl = null;
//our shader program
var shaderProgram = null;

var canvasWidth = 800;
var canvasHeight = 800;
var aspectRatio = canvasWidth / canvasHeight;

//camera and projection settings
var fieldOfViewInRadians = convertDegreeToRadians(30);

var modelViewLocation;
var positionLocation;
var colorLocation;
var projectionLocation;

//load the shader resources using a utility function
loadResources({
    vs: 'shader/simple.vs.glsl',
    fs: 'shader/simple.fs.glsl'
}).then(function (resources /*an object containing our keys with the loaded resources*/) {
    init(resources);

    //render one frame
    render();
});

/**
 * initializes OpenGL context, compile shader, and load buffers
 */
function init(resources) {

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

    // initialization of scenes
    initTestScene();
}

/**
 * render one frame
 */
function render(timeInMilliseconds) {
    clock.update(timeInMilliseconds);

    //set background color to light gray
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    //clear the buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //enable depth test to let objects in front occluse objects further away
    gl.enable(gl.DEPTH_TEST);

    //activate this shader program
    gl.useProgram(shaderProgram);

    // write out camera matrices
    camera.writeProjectionMatrix();
    camera.writeModelViewMatrix();

    // render scene
    renderTestScene();

    //request another render call as soon as possible
    requestAnimationFrame(render);
}