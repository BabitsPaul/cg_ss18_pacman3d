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
        // FPS-camera
        // source: https://www.3dgep.com/understanding-the-view-matrix/

        /*
        let cosPitch = Math.cos(pitch);
        let sinPitch = Math.sin(pitch);
        let cosYaw = Math.cos(yaw);
        let sinYaw = Math.sin(yaw);

        let xaxis = [ cosYaw, 0, -sinYaw ];
        let yaxis = [ sinYaw * sinPitch, cosPitch, cosYaw * sinPitch ];
        let zaxis = [ sinYaw * cosPitch, -sinPitch, cosPitch * cosYaw ];

        // Create a 4x4 view matrix from the right, up, forward and eye position vectors
        let viewMatrix = {
            vec4(xaxis.x, yaxis
    .
        x, zaxis.x, 0
    ),
        vec4(xaxis.y, yaxis.y, zaxis.y, 0),
            vec4(xaxis.z, yaxis.z, zaxis.z, 0),
            vec4(-dot(xaxis, eye), -dot(yaxis, eye), -dot(zaxis, eye), 1)

        // TODO correct rotation around z-axis
        */

        var tmpRot = makeIdentityMatrix();
        tmpRot = matrixMultiply(makeXRotationMatrix(this.rotationX * this.rotationScale * dt), tmpRot);
        tmpRot = matrixMultiply(makeYRotationMatrix(this.rotationY * this.rotationScale * dt), tmpRot);
        // tmpRot = matrixMultiply(makeZRotationMatrix(-Math.asin(tmpRot[1])), tmpRot);      // correct rotation around z-axis
        tmpRot[1] = 0;
        tmpRot[9] = 0;

        var tmp = matrixMultiply(tmpRot, this.viewMatrix);
        tmp = matrixMultiply(makeTranslationMatrix(this.moveX * this.movementScale * dt, 0, this.moveZ * this.movementScale * dt), tmp);

        // position
        console.log(tmp[12], tmp[13], tmp[14]);

        this.viewMatrix = tmp;

        // reset rotation (cumulative)
        this.rotationX = 0;
        this.rotationY = 0;

        // keep the function in the update-loop of the clock
        return true;
    }
}
