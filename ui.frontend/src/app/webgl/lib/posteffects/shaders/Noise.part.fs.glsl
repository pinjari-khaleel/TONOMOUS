uniform float _NoiseAmount;

float noisehash13(highp vec3 p3) {
	p3  = fract(p3 * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 noise(vec2 uv, vec3 color) {
    float noise = noisehash13(gl_FragCoord.xyx) - .5;
	return max(vec3(0.), color + noise * (_NoiseAmount / 255.));
}