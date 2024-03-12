// https://github.com/spite/looper/tree/master/shaders

uniform float _RgbShiftDelta;

vec3 rgbshift(vec2 uv, vec3 color) {
	vec2 dir = uv - vec2( .5 );
	float d = .7 * length( dir );
	vec2 value = d * normalize( dir ) * _RgbShiftDelta;

	float r = texture2D( uTexture, uv - value / uResolution.x ).r;
	float g = texture2D( uTexture, uv ).g;
	float b = texture2D( uTexture, uv + value / uResolution.y ).b;

	return vec3(r, g, b);
}