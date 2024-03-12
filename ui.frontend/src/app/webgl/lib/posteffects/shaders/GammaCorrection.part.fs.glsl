uniform float _ExposureLevelBlack;
uniform float _ExposureLevelWhite;
uniform float _ExposureGamma;
uniform float _ExposureExposure;

vec3 gammacorrection(vec2 uv, vec3 color) {
	color = 1. - exp(-color);
	color = max((color-_ExposureLevelBlack) * (1./(_ExposureLevelWhite-_ExposureLevelBlack)), vec3(0));
	return pow(color * _ExposureExposure, vec3(1./_ExposureGamma));
}