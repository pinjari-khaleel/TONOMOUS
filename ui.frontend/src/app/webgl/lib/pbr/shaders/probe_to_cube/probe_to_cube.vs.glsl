attribute vec3 aPos;
attribute vec2 aUV0;

uniform vec2 _Offset;
uniform vec2 _Scale;

varying vec2 vUV;

void main(void) {
	vUV = aUV0 * _Scale + _Offset;

	gl_Position = vec4(aPos, 1.0);
}