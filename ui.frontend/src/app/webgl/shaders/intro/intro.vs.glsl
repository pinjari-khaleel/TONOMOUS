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

uniform float _SourceAspectRatio;
uniform float _AspectRatio;

void main(void) {
	vUV = aUV0;
	vUV -= .5;
	vUV *= _AspectRatio > _SourceAspectRatio ? vec2(1., _SourceAspectRatio / _AspectRatio) :  vec2(_AspectRatio / _SourceAspectRatio, 1.);
	vUV += .5;

	gl_Position = vec4(aPos, 1.0);
}