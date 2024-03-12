uniform float _BrightnessContrastBrightness;
uniform float _BrightnessContrastContrast;

vec3 brightnesscontrast(vec2 uv, vec3 color) {
	color = clamp(color * _BrightnessContrastBrightness, vec3(0), vec3(1));
	return mix(color, color*color*(3.-2.*color), _BrightnessContrastContrast);
//	return max(vec3(0.), (color * _BrightnessContrastBrightness - .5) * _BrightnessContrastContrast + .5);
}