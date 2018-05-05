/**
 * base node of the scenegraph
 */
class SceneGraphNode {

    constructor() {
        this.children = [];
    }

    /**
     * appends a new child to this node
     * @param child the child to append
     * @returns {SceneGraphNode} the child
     */
    append(child) {
        this.children.push(child);
        return child;
    }

    /**
     * removes a child from this node
     * @param child
     * @returns {boolean} whether the operation was successful
     */
    remove(child) {
        var i = this.children.indexOf(child);
        if (i >= 0) {
            this.children.splice(i, 1);
        }
        return i >= 0;
    };

    /**
     * render method to render this scengraph
     * @param context
     */
    render(context) {

        //render all children
        this.children.forEach(function (c) {
            return c.render(context);
        });
    };
}

/**
 * a transformation node, i.e applied a transformation matrix to its successors
 */
class TransformationSceneGraphNode extends SceneGraphNode {
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

/**
 * a shader node sets a specific shader for the successors
 */
class ShaderSceneGraphNode extends SceneGraphNode {
    /**
     * constructs a new shader node with the given shader program
     * @param shader the shader program to use
     */
    constructor(shader) {
        super();
        this.shader = shader;
    }

    render(context) {
        //backup prevoius one
        var backup = context.shader;
        //set current shader
        context.shader = this.shader;
        //activate the shader
        context.gl.useProgram(this.shader);
        //set projection matrix
        gl.uniformMatrix4fv(gl.getUniformLocation(context.shader, 'u_projection'),
            false, context.projectionMatrix);
        //render children
        super.render(context);
        //restore backup
        context.shader = backup;
        //activate the shader
        context.gl.useProgram(backup);
    }
};

// custom nodes

class ObjectSceneGraphNode extends SceneGraphNode
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

class SceneGraphRootNode
    extends SceneGraphNode
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

        super.render(context);
    }
}

class TrackObjectGraphNode
    extends TransformationSceneGraphNode
{
    constructor(track)
    {
        super();

        this.track = track;
    }

    render(context)
    {
        var pos = this.track.position;

        this.matrix = makeTranslationMatrix(pos[0], pos[1], pos[2]);

        super.render(context);
    }
}