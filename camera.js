/////////////////////////////////////////////////////////////////////////////
// camera
//

// TODO use track-definition in order to move the camera

var camera = {
    /* Configuration */
    rotationScale : .0001,      // regulates the speed of the camera rotation
    movementScale : .0025,      // regulates the speed of the camera movement
    viewDepth : 100,            // maximum-depth at which objects are still visible
    movementOnMousePress : true,// only rotate the camera if the left-button is pressed
    mouseInverted: false,       // invert the mouse
    moveForward : "KeyW",       // keyboard forward-movement
    moveBackward : "KeyS",      // keyboard backward-movement
    moveLeft : "KeyA",          // keyboard left-movement
    moveRight : "KeyD",         // keyboard right-movement
    fov : Math.PI / 3,          // field of view
    zNear : .1,                 // close clipping plane of perspective
    zFar : 100,                 // far clipping plane of the perspective

    /* screen and view-matrix */
    sceneMatrix : makeIdentityMatrix(),
    viewMatrix : lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0),
    projectionMatrix : null,

    /* current movement of the camera */
    rotationX : 0,
    rotationY : 0,
    moveX : 0,
    moveZ : 0,

    userControlled: false,
    mousePressed: false,

    /**
     * Sets the camera up to listen to user-input and registers it with
     * the clock to listen for ticks
     */
    init: function()
    {
        this.projectionMatrix = makePerspectiveProjectionMatrix(this.fov, aspectRatio, this.zNear, this.zFar);

        // this is not visible inside nested functions => reference via additional variable
        let thisr = this;

        // register camera on the clock to receive updates
        clock.registerUpdateable(this);

        document.onkeydown = function (ev) {
            thisr.userControlled = true;

            switch (ev.code){
                case thisr.moveForward:        thisr.moveZ = 1;     break;
                case thisr.moveBackward:       thisr.moveZ = -1;    break;
                case thisr.moveLeft:           thisr.moveX = 1;    break;
                case thisr.moveRight:          thisr.moveX = -1;     break;

                default:                        thisr.userControlled = false;
            }
        };

        document.onkeyup = function (ev) {
            switch (ev.code){
                case thisr.moveBackward:
                case thisr.moveForward:        thisr.moveZ = 0;     break;
                case thisr.moveLeft:
                case thisr.moveRight:          thisr.moveX = 0;     break;

                default:                        thisr.userControlled = false;
            }
        };

        document.onmousemove = function (ev) {
            if(!thisr.movementOnMousePress || thisr.mousePressed)
            {
                thisr.rotationX += ev.movementY * (thisr.mouseInverted ? -1 : 1);
                thisr.rotationY += ev.movementX * (thisr.mouseInverted ? -1 : 1);
            }
        };

        document.onmousedown = function (ev) {
            if(ev.button === 0)
                thisr.mousePressed = true;
        };

        document.onmouseup = function (ev) {
            if(ev.button === 0)
                thisr.mousePressed = false;
        };
    },

    /**
     * Updates the camera on every update
     *
     * @param dt time since last update
     */
    update: function(dt)
    {
        mat4.invert(this.viewMatrix, this.viewMatrix);

        // update position and orientation
        mat4.rotate(this.viewMatrix, this.viewMatrix, this.rotationX * this.rotationScale * dt, vec3.fromValues(1, 0, 0));
        mat4.rotate(this.viewMatrix, this.viewMatrix, this.rotationY * this.rotationScale * dt, vec3.fromValues(0, 1, 0));
        mat4.translate(this.viewMatrix, this.viewMatrix, vec3.fromValues(- this.moveX * this.movementScale * dt, 0, - this.moveZ * this.movementScale * dt));

        // correct z-axis rotation
        var angleZ = Math.asin(vec3.dot(    // angle between z-axis and right-vector of the viewmatrix
            vec3.normalize(vec3.create(), vec3.fromValues(this.viewMatrix[0], this.viewMatrix[1], this.viewMatrix[2])),
            vec3.normalize(vec3.create(), vec3.fromValues(0, 1, 0))
        ));

        mat4.rotate(this.viewMatrix, this.viewMatrix, - angleZ, vec3.fromValues(0, 0, 1));    // correct rotation

        mat4.invert(this.viewMatrix, this.viewMatrix);

        // reset rotation (cumulative)
        this.rotationX = 0;
        this.rotationY = 0;

        // keep the function in the update-loop of the clock
        return true;
    }
}
