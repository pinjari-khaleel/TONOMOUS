// https://github.com/spite/looper/tree/master/shaders

uniform float _Gamma;

vec3 gamma(vec2 uv, vec3 color) {
	return pow(max(vec3(0.), color), vec3(_Gamma));
}