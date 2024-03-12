attribute vec3 aPos;
attribute vec2 aUV0;

varying vec2 vUV;

void main(void) {
	gl_Position = vec4(aPos, 1.0);
	vUV = aUV0;
}