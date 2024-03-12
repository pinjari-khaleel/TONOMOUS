uniform float _VignettePow;
uniform float _VignetteReduction;

vec3 vignette(vec2 uv, vec3 color) {
	uv *=  1.0 - uv.yx;
	return ((1.-_VignetteReduction) + pow(uv.x*uv.y*16., _VignettePow) *_VignetteReduction) * color;
}