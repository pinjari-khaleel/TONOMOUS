#ifndef NO_LOD_EXTENSION
#extension GL_EXT_shader_texture_lod : enable
#endif

precision highp float;


varying vec3 vWorld;

uniform samplerCube  _CubeSampler;

uniform float _Exposure;
uniform float _Lod;

vec3 cubeMapLookup(samplerCube s, vec3 N, float lod) {
#ifdef NO_LOD_EXTENSION
	return textureCube(s, N).rgb;
#else
	return textureCubeLodEXT(s, N, lod).rgb;
#endif
}

void main(void) {
	vec3 color = cubeMapLookup(_CubeSampler, vWorld, _Lod).rgb;

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
//	gl_FragColor = vec4(1.0, 0.,0., 1.0);
}