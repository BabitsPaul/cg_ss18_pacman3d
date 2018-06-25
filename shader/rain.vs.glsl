// particle vertex shader

precision mediump float;

uniform float uTime;
uniform vec3 uCenterPosition;

attribute vec3 a_position;
attribute float aLifeTime;
attribute vec3 aStartPosition;
attribute vec3 aEndPosition;

uniform mat4 uModelView;
uniform mat4 uProjection;

void main() {
    // let particles iterate over their position throughout their life
    float time = mod(uTime, aLifeTime);

    /*
    gl_Position =
        uProjection *
        uModelView *
        vec4(a_position + uCenterPosition + (time / aLifeTime * aEndPosition + (1. - time / aLifeTime) * aStartPosition), 0.);
        */

    // float lambda = time / aLifeTime;
    vec3 position = a_position + uCenterPosition + aStartPosition; // + vec3(.5, .5, 1) * (time / 10000.);

    gl_Position = uProjection * uModelView * vec4(position, 1.);
}
