#ifndef NO_LOD_EXTENSION
#extension GL_EXT_shader_texture_lod : enable
#endif

precision highp float;


varying vec3 vWorld;

uniform sampler2D  _TextureSampler;

uniform float _Exposure;
uniform float _Lod;

const vec2 invAtan = vec2(0.1591,0.3183);

void main(void) {
	vec3 v = normalize( vWorld );

	vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
	uv *= invAtan;
	uv += 0.5;

#ifdef NO_LOD_EXTENSION
	vec3 color = texture2D(_TextureSampler, uv).rgb;
#else
	vec3 color = texture2DLodEXT(_TextureSampler, uv, _Lod).rgb;
#endif

#ifdef LDR_MAPS
	color = color * color * color * color * 8.;
#endif

#ifndef HDR_OUTPUT
//	color = vec3(1.0) - exp2(-color * _Exposure);
//	color = pow(color, vec3(1.0/2.2));
	color *= _Exposure;
	color = max( vec3(0), color - 0.004);
	color = (color*(6.2*color + .5)) / (color*(6.2*color+1.7) + 0.06);
#endif

	gl_FragColor = vec4(color, 1.0);
}