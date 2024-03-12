precision mediump float;

attribute vec3 aPos;
attribute vec2 aUV0;

varying vec2 vUV;

void main(void) {
	vUV = aUV0;
	gl_Position = vec4(aPos, 1.0);
}