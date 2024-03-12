uniform float _NoiseAnimatedAmount;

float noiseanimatedhash13(highp vec3 p3) {
	p3  = fract(p3 * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 noiseanimated(vec2 uv, vec3 color) {
    float noise = noiseanimatedhash13(vec3(gl_FragCoord.xy, uTime)) - .5;
	return max(vec3(0.), color + noise * (_NoiseAnimatedAmount / 255.));
}