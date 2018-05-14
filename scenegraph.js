// TODO remove
class SceneGraphNode extends SGNode{}

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

class ObjectSGNode extends SGNode
{
    /**
     * Constructs an new Object-node used to render objects. An object is in this
     * context specified by the number of vertices (param bufferSize), it's vertexbuffer,
     * colorBuffer and optionally an indexbuffer.
     *
     * Objects are rendered with gl.Triangles
     *
     * @param bufferSize number of vertices of the object
     * @param vertexBuffer vertexbuffer of the object
     * @param colorBuffer colorbuffer of the object
     * @param indexBuffer optional indexBuffer
     */
    constructor(bufferSize, vertexBuffer, colorBuffer, indexBuffer)
    {
        super();

        this.bufferSize = bufferSize;
        this.vertexBuffer = vertexBuffer;
        this.colorBuffer = colorBuffer;
        this.indexBuffer = indexBuffer;
    }

    render(context)
    {
        // write modelview matrix
        var modelViewMatrix = mat4.multiply(mat4.create(), context.viewMatrix, context.sceneMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(context.shader, 'u_modelView'), false, modelViewMatrix);

        gl = context.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false,0,0) ;
        gl.enableVertexAttribArray(positionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false,0,0) ;
        gl.enableVertexAttribArray(colorLocation);

        if(this.indexBuffer !== null)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.bufferSize, gl.UNSIGNED_SHORT, 0);

        super.render(context);
    }
}

/**
 * Root node initializes rendering
 *
 * Sets up the context with data
 * from the camera, sets the shader
 * and writes the projectionMatrix
 */
class SceneGraphRootNode
    extends SGNode
{
    constructor()
    {
        super();
    }

    render(context)
    {
        // setup shader
        context.gl.useProgram(context.shader);

        // backup old context
        var tmpScene = context.sceneMatrix;
        var tmpView = context.viewMatrix;
        var tmpProjection = context.projectionMatrix;

        // update context
        context.sceneMatrix = camera.sceneMatrix;
        context.viewMatrix = camera.viewMatrix;
        context.projectionMatrix = camera.projectionMatrix;

        // write projection-matrix
        context.gl.uniformMatrix4fv(projectionLocation, false, new Float32Array(context.projectionMatrix));

        // render child-nodes
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
    constructor(track)
    {
        super();

        this.track = track;
    }

    render(context)
    {
        this.matrix = mat4.translate(this.matrix, mat4.create(), this.track.vec3Position);

        super.render(context);
    }
}

/* Update sg to add helper-functions for newly defined nodes */
sg.object = function(bufferSize, vertexBuffer, colorBuffer, indexBuffer){
    return new ObjectSGNode(bufferSize, vertexBuffer, colorBuffer, indexBuffer);
};

sg.track = function(track){
    return new TrackSGNode(track);
};