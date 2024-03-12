// https://github.com/spite/looper/tree/master/shaders

uniform float _BarrelK;
uniform float _BarrelKCube;

vec2 barrelComputeUV(vec2 uv, const float k, const float kcube) {
	vec2 t = uv - .5;
	float r2 = t.x * t.x + t.y * t.y;
	float f = 0.;

	if (kcube == 0.0) {
		f = 1. + r2 * k;
	} else {
		f = 1. + r2 * (k + kcube * sqrt(r2));
	}

	vec2 nUv = f * t + .5;
	nUv.y = nUv.y;

	return nUv;
}

vec3 barrel(vec2 uv, vec3 color) {
	vec2 buv = barrelComputeUV(uv, _BarrelK, _BarrelKCube);
	if (buv.x < 0. || buv.x > 1. || buv.y < 0. || buv.y > 1.) {
		return vec3(0);
	} else {
		vec3 c = texture2D(uTexture, buv).rgb;
		return c;
	}
}