//the OpenGL context
let gl = null;
//our shader program
let shaderProgram = null;
let phongShader = null;
let particleShader = null;

let canvasWidth = 800;
let canvasHeight = 800;
let aspectRatio = canvasWidth / canvasHeight;

//load the shader resources using a utility function
loadResources({
    vs :    'shader/simple.vs.glsl',
    fs :    'shader/simple.fs.glsl',
    pvs :   'shader/phong.vs.glsl',
    pfs :   'shader/phong.fs.glsl',
    rvs :   'shader/rain.vs.glsl',
    rfs :   'shader/rain.fs.glsl',
    lava :  'texture/lava.jpg'
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
    phongShader = createProgram(gl, resources.pvs, resources.pfs);
    particleShader = createProgram(gl, resources.rvs, resources.rfs);
    particleShader.name = 'particle shader';

    // initialization of components
    camera.init();
    clock.init();
    world.init();

    // initialization of scenes
    initStaticScene(resources);
    initScene1();

    // run world
    world.start();
}

const world = {
    /* sg-context for rendering */
    sg_context : {
        gl: gl,
        sceneMatrix: mat4.create(),
        viewMatrix: mat4.create(),
        projectionMatrix: null,
        shader: null
    },

    /* represents the global light in the scene */
    light : {
        position : [5, 5, 5]
    },

    sceneRootNode : null,
    renderRootNode : null,
    scene : null,

    rain : null,

    /* List of scenes and triggers */
    scenes : [],
    ccrs : [],

    init() {
        // init scenegraph-context
        this.sg_context.gl = gl;
        this.sg_context.shader = phongShader; // shaderProgram;

        this.rain = new ParticleSGNode(2, [0, 0, 0], [0, 0, .5, 1.]);

        // init scenegraph
        this.sceneRootNode = sg.root();
        this.renderRootNode =
            sg.root(
                sg.shader(phongShader,
                    sg.camera(camera,
                        sg.light(this.light),    // TODO set invView uniform
                        this.sceneRootNode
                    )
                )
            );

        let self = this;

        clock.registerClockReaction(
            () => {
                // react to the camera being controlled by the user
                if(camera.userControlled)
                {

                    // stop all ccrs
                    self.ccrs.forEach(c => c.terminate());

                    // check the position of the camera to launch scenes as required
                    let toLaunch = self.scenes.filter(v => v.shouldStart(camera.position));

                    // check for scenes to launch
                    if(toLaunch.length > 1)
                        console.warn("Multiple candidates");

                    // start only the first found scene that should be started
                    // ignore if it's already running
                    if(toLaunch.length > 0 && toLaunch[0] !== self.scene)
                        toLaunch[0].start();
                }
            }
        );
    },

    render(timeInMillis)
    {
        // notify clock that a new frame is being rendered
        clock.update(timeInMillis);

        // setup for new frame
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // clear buffer
        gl.enable(gl.DEPTH_TEST);                               // enable depth-test

        // render scene
        this.renderRootNode.render(this.sg_context);                  // render scene

        /*
        gl.useProgram(particleShader);

        this.sg_context.shader = particleShader;
        this.sg_context.projectionMatrix = camera.projectionMatrix;
        this.sg_context.sceneMatrix = camera.sceneMatrix;
        this.sg_context.viewMatrix = mat4.multiply(mat4.create(), camera.viewMatrix, mat4.scale(mat4.create(), mat4.create(), [10., 10., 10.]));
        this.rain.render(this.sg_context);
        */
    },

    setStaticScene(sgRoot)
    {
        // remove old staticScene
        this.sceneRootNode.append(sgRoot);
    },

    addScene(scene)
    {
        this.scenes.push(scene);
    },

    start()
    {

        let self = this;

        this.scenes.forEach((v, i) => {
            let ccr = clock.registerCumulativeClockReaction(
                1e4 * i,                    // 10 seconds per scene
                () => self.switchScene(v),  // switch scene,
                false                       // don't repeat
            );

            self.ccrs.push(ccr);
        });
    },

    switchScene(scene)
    {
        // dispose of old scene
        if(this.scene)
            this.scene.stop();

        // update world-object and scenegraph
        this.scene = scene;

        this.sceneRootNode.remove(this.scene.sg);
        this.sceneRootNode.append(scene.sg);

        // start new scene
        scene.start();
    }
};
