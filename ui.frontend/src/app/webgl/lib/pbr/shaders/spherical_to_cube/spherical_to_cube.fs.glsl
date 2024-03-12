precision highp float;


varying vec3 vWorld;

uniform sampler2D  _Environment;

const vec2 invAtan = vec2(0.1591,0.3183);
vec3 sampleSpherical(vec3 v)
{
	vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
	uv *= invAtan;
	uv += 0.5;
	return texture2D(_Environment, uv).xyz;
}

void main(void) {
	vec3 color = sampleSpherical(normalize(vWorld));

	gl_FragColor = vec4(color, 1.0);
}