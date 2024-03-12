attribute vec3 aPos;

varying vec2 vUV;
varying vec3 vWorld;

uniform mat3 _View;
uniform mat4 _Projection;

void main(void) {
	vec3 viewPos = _View * aPos;
	vec4 pos = _Projection * vec4(viewPos, 1.0);
	gl_Position = pos * 9.9;

	vWorld = aPos;
}