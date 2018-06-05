/**
 * a transformation node, i.e applied a transformation matrix to its successors
 */
class TransformationSceneGraphNode extends SGNode {
    /**
     * the matrix to apply
     * @param matrix
     */
    constructor(matrix) {
        super();
        this.matrix = matrix || mat4.create();
    }

    render(context) {
        //backup previous one
        var previous = context.sceneMatrix;
        //set current world matrix by multiplying it
        if (previous === null) {
            context.sceneMatrix = mat4.clone(this.matrix);
        }
        else {
            context.sceneMatrix = mat4.multiply(mat4.create(), previous, this.matrix);
        }

        //render children
        super.render(context);
        //restore backup
        context.sceneMatrix = previous;
    }

    setMatrix(matrix) {
        this.matrix = matrix;
    }
}

// custom nodes
class CameraSGNode
    extends SGNode
{
    constructor(camera, children)
    {
        super(children);

        this.camera = camera;
    }

    render(context)
    {
        // backup old context
        var tmpScene = context.sceneMatrix;
        var tmpView = context.viewMatrix;
        var tmpProjection = context.projectionMatrix;

        // update context
        context.sceneMatrix = this.camera.sceneMatrix;
        context.viewMatrix = this.camera.viewMatrix;
        context.projectionMatrix = this.camera.projectionMatrix;

        super.render(context);

        // reset context
        context.sceneMatrix = tmpScene;
        context.viewMatrix = tmpView;
        context.projectionMatrix = tmpProjection;
    }
}

class TrackSGNode
    extends TransformationSGNode
{
    constructor(track, children)
    {
        super(children);

        this.track = track;
    }

    render(context)
    {
        this.matrix = mat4.translate(this.matrix, mat4.create(), this.track.vec3Position);

        super.render(context);
    }
}

class WorldLightSGNode
    extends LightSGNode
{
    constructor(light, children)
    {
        super(light.position, children);

        this.light = light;
    }

    render(context)
    {
        this.position = this.light.position;

        console.log(gl.getUniformLocation(context.shader, "u_light.ambient"));

        super.render(context);
    }
}

/* Update sg to add helper-functions for newly defined nodes */
sg.track = function(track){
    return new TrackSGNode(track, [].slice.call(arguments).slice(1));
};

sg.camera = function(camera){
    return new CameraSGNode(camera, [].slice.call(arguments).slice(1));
};

sg.light = function(light){
    return new WorldLightSGNode(light, [].slice.call(arguments).slice(1));
};
