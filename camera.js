/////////////////////////////////////////////////////////////////////////////
// camera
//

var camera = {
    /* Configuration */
    rotationScale : .0001,      // regulates the speed of the camera rotation
    movementScale : .01,      // regulates the speed of the camera movement
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
    sceneMatrix : mat4.create(),
    viewMatrix : mat4.lookAt(mat4.create(),
            vec3.fromValues(0, 0, -5),       // eye
            vec3.fromValues(0, 0, 0),       // look at
            vec3.fromValues(0, 1, 0)),      // up-vector

    projectionMatrix : null,

    /* current movement of the camera */
    rotationX : 0,
    rotationY : 0,
    moveX : 0,
    moveZ : 0,
    position : vec3.fromValues(0, 0, 0),

    userControlled: false,
    mousePressed: false,

    /* tracks */
    locationTrack : null,       // these two tracks need not be registered with the clock,
    orientationTrack : null,    // as they will be updated by the camera itself

    /**
     * Sets the camera up to listen to user-input and registers it with
     * the clock to listen for ticks
     */
    init: function()
    {
        this.projectionMatrix = mat4.perspective(mat4.create(), this.fov, aspectRatio, this.zNear, this.zFar);

        let self = this;

        // register camera on the clock to receive updates
        clock.registerUpdateable(this);

        document.onkeydown = function (ev) {
            self.userControlled = true;

            switch (ev.code){
                case self.moveForward:        self.moveZ = 1;     break;
                case self.moveBackward:       self.moveZ = -1;    break;
                case self.moveLeft:           self.moveX = 1;    break;
                case self.moveRight:          self.moveX = -1;     break;

                default:                        self.userControlled = false;
            }
        };

        document.onkeyup = function (ev) {
            switch (ev.code){
                case self.moveBackward:
                case self.moveForward:        self.moveZ = 0;     break;
                case self.moveLeft:
                case self.moveRight:          self.moveX = 0;     break;
            }
        };

        document.onmousemove = function (ev) {
            if(!self.movementOnMousePress || self.mousePressed)
            {
                self.rotationX += ev.movementY * (self.mouseInverted ? -1 : 1);
                self.rotationY += ev.movementX * (self.mouseInverted ? -1 : 1);
            }
        };

        document.onmousedown = function (ev) {
            if(ev.button === 0)
            {
                self.userControlled = true;
                self.mousePressed = true;
            }
        };

        document.onmouseup = function (ev) {
            if(ev.button === 0)
                self.mousePressed = false;
        };
    },

    /**
     * Updates the camera on every update
     *
     * @param dt time since last update
     */
    update: function(dt)
    {
        if(this.userControlled)
        {
            mat4.invert(this.viewMatrix, this.viewMatrix);

            let rotX = this.rotationX * this.rotationScale * dt;
            let rotY = this.rotationY * this.rotationScale * dt;

            // update position and orientation
            mat4.rotate(this.viewMatrix, this.viewMatrix, rotX, vec3.fromValues(1, 0, 0));
            mat4.rotate(this.viewMatrix, this.viewMatrix, rotY, vec3.fromValues(0, 1, 0));
            mat4.translate(this.viewMatrix, this.viewMatrix, vec3.fromValues(- this.moveX * this.movementScale * dt, 0, - this.moveZ * this.movementScale * dt));

            // correct z-axis rotation
            let angleZ = Math.asin(vec3.dot(    // angle between z-axis and right-vector of the viewmatrix
                vec3.normalize(vec3.create(), vec3.fromValues(this.viewMatrix[0], this.viewMatrix[1], this.viewMatrix[2])),
                vec3.normalize(vec3.create(), vec3.fromValues(0, 1, 0))
            ));

            mat4.rotate(this.viewMatrix, this.viewMatrix, - angleZ, vec3.fromValues(0, 0, 1));    // correct rotation

            // get position
            this.position = vec3.fromValues(this.viewMatrix[12], this.viewMatrix[13], this.viewMatrix[14]);

            mat4.invert(this.viewMatrix, this.viewMatrix);

            // reset rotation (cumulative)
            this.rotationX = 0;
            this.rotationY = 0;
        }
        else if(this.locationTrack && this.orientationTrack)
        {
            mat4.invert(this.viewMatrix, this.viewMatrix);

            // update viewmatrix
            mat4.translate(this.viewMatrix, mat4.create(), this.locationTrack.vec3Position);
            mat4.multiply(this.viewMatrix, this.viewMatrix, mat4.fromQuat(mat4.create(), quat.rotationTo(quat.create(), vec3.fromValues(0, 0, 1), vec3.normalize(vec3.create(), this.orientationTrack.vec3Position))));

            mat4.invert(this.viewMatrix, this.viewMatrix);

            // update position
            this.position = this.locationTrack.vec3Position;
        }

        // keep the function in the update-loop of the clock
        return true;
    }
}
