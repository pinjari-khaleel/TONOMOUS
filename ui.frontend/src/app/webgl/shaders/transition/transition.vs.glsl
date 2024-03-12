#ifdef WEBGL2
	#version 300 es
	in vec3 aPos;
	in vec2 aUV0;

	out vec2 vUV;
#else
	attribute vec3 aPos;
	attribute vec2 aUV0;

	varying vec2 vUV;
#endif

void main(void) {
	vUV = aUV0;
	gl_Position = vec4(aPos, 1.0);
}