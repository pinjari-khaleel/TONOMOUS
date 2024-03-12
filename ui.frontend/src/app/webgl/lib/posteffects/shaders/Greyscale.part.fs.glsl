uniform float _GrayscaleAmount;

vec3 grayscale(vec2 uv, vec3 color) {
	return mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), _GrayscaleAmount);
}