/////////////////////////////////////////////////////////////////////////////
// camera
//

// TODO use track-definition in order to move the camera

let camera = {
    /* Configuration */
    rotationScale : .0001,      // regulates the speed of the camera rotation
    movementScale : .0025,      // regulates the speed of the camera movement
    viewDepth : 100,            // maximum-depth at which objects are still visible
    movementOnMousePress : true,// only rotate the camera if the left-button is pressed
    mouseInverted: false,       // invert the mouse

    /* screen and view-matrix */
    sceneMatrix: makeIdentityMatrix(),
    viewMatrix: lookAt(0, 0, 3, 0, 0, 0, 0, 1, 0),

    /* current movement of the camera */
    rotationX : 0,
    rotationY : 0,
    moveX : 0,
    moveZ : 0,

    userControlled: false,
    mousePressed: false,

    writeProjectionMatrix: function()
    {
        var projectionMatrix = makePerspectiveProjectionMatrix(fieldOfViewInRadians, aspectRatio, .1, this.viewDepth);
        gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    },

    writeModelViewMatrix: function() {
        var modelViewMatrix = matrixMultiply(this.viewMatrix, this.sceneMatrix );
        gl.uniformMatrix4fv(modelViewLocation, false, modelViewMatrix);
    },

    /**
     * Sets the camera up to listen to user-input and registers it with
     * the clock to listen for ticks
     */
    init: function()
    {
        // this is not visible inside nested functions => reference via additional variable
        let thisr = this;

        // register camera on the clock to receive updates
        clock.registerUpdateable(this);

        let move_forward = "KeyW";
        let move_backward = "KeyS";
        let move_left = "KeyA";
        let move_right = "KeyD";

        document.onkeydown = function (ev) {
            thisr.userControlled = true;

            switch (ev.code){
                case move_forward:      thisr.moveZ = -1;     break;
                case move_backward:     thisr.moveZ = 1;    break;
                case move_left:         thisr.moveX = 1;    break;
                case move_right:        thisr.moveX = -1;     break;

                default:                thisr.userControlled = false;
            }
        };

        document.onkeyup = function (ev) {
            switch (ev.code){
                case move_backward:
                case move_forward:      thisr.moveZ = 0;     break;
                case move_left:
                case move_right:        thisr.moveX = 0;     break;

                default:                thisr.userControlled = false;
            }
        };

        document.onmousemove = function (ev) {
            if(!thisr.movementOnMousePress || thisr.mousePressed)
            {
                thisr.rotationX += ev.movementY * (thisr.mouseInverted ? 1 : -1);
                thisr.rotationY += ev.movementX * (thisr.mouseInverted ? 1 : -1);
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
        var tmp = this.sceneMatrix;
        tmp = matrixMultiply(makeTranslationMatrix(this.moveX * this.movementScale * dt, 0, this.moveZ * this.movementScale * dt), tmp);
        tmp = matrixMultiply(makeXRotationMatrix(this.rotationX * this.rotationScale * dt), tmp);
        tmp = matrixMultiply(makeYRotationMatrix(this.rotationY * this.rotationScale * dt), tmp);

        this.sceneMatrix = tmp;

        // reset rotation (cumulative)
        this.rotationX = 0;
        this.rotationY = 0;

        // keep the function in the update-loop of the clock
        return true;
    },
};