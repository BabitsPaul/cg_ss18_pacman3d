class ParticleSGNode
    extends SGNode
{
    constructor(particleCount, position, color, children) {
        super(children);

        this.particleCount = particleCount;
        this.position = position;
        this.color = color;

        // get relevant uniforms and attributes
        this.initBuffers();
    }

    initBuffers()
    {
        // use diamond-shaped particles for rain
        var model = makeSphere(.01, 3, 4);

        var tmp = [].concat(model.index);
        for(var i = 1; i < this.particleCount; i++)
        {
            model.index = model.index.concat(tmp);
        }

        // actual renderer
        this.renderer = modelRenderer(model);

        // populate arrays for attributes
        var lifeTime = [];
        var startPosition = [];
        var endPosition = [];

        for(var i = 0; i < model.index.length; i++)
        {
            var start = [
                Math.random() - .5,
                Math.random() - .5,
                clamp(Math.random() + .5, .75, 1)
            ];

            lifeTime.push(clamp(Math.random() * 1e3, 1e5, 1e3));

            startPosition.push(start[0], start[1], start[2]);

            endPosition.push(
                clamp(start[0] + Math.random() * .05, -.5, .5),
                clamp(start[1] + Math.random() * .05, -.5, .5),
                clamp(Math.random() -5, .25, 0)
            )
        }

        // initialize buffers
        function initBuffer(buf)
        {
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buf), gl.STATIC_DRAW);

            return buffer;
        }

        this.lifeTime = initBuffer(lifeTime);
        this.startPosition = initBuffer(startPosition);
        this.endPosition = initBuffer(endPosition);
    }

    setAttributes(context)
    {
        function setAttribute(attrName, buffer, size)
        {
            var size = size || 3;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            var attribute = gl.getAttribLocation(context.shader, attrName);
            gl.enableVertexAttribArray(attribute);
            gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0);
        }

        // setAttribute('aLifeTime', this.lifeTime, 1);
        setAttribute('aStartPosition', this.startPosition);
        // setAttribute('aEndPosition', this.endPosition);
    }

    setUniforms(context)
    {
        var uniform = gl.getUniformLocation(context.shader, 'uCenterPosition');
        gl.uniform3fv(uniform, new Float32Array(this.position));

        uniform = gl.getUniformLocation(context.shader, 'uColor');
        gl.uniform4fv(uniform, new Float32Array(this.color));

        uniform = gl.getUniformLocation(context.shader, 'uModelView');
        gl.uniformMatrix4fv(uniform, false, mat4.multiply(mat4.create(), context.viewMatrix, context.sceneMatrix));

        uniform = gl.getUniformLocation(context.shader, 'uProjection');
        gl.uniformMatrix4fv(uniform, false, context.projectionMatrix);

        uniform = gl.getUniformLocation(context.shader, 'uTime');
        gl.uniform1f(uniform, clock.oldTime);
    }

    render(context)
    {
        super.render(context);

        this.setAttributes(context);
        this.setUniforms(context);
        this.renderer(context);
    }
}