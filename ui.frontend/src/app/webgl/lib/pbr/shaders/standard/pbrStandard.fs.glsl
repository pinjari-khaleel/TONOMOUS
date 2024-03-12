//
// GOD shader - optional defines:
//
// USE_ROUGHNESS
// USE_METALLIC
// USE_EMISSIVE
//
// USE_ALBEDO_VALUE
// USE_ROUGHNESS_VALUE
// USE_METALLIC_VALUE
// USE_EMISSIVE_VALUE
//
// USE_NORMAL_MAP
// USE_AO_MAP
//
// USE_UV1_FOR_AO_MAP       ( use UV1 channel (instead of UV0) for AO texture lookup )
// HDR_OUTPUT               ( don't tonemap hdr result )
// SCALE_UV0                ( scale UV0 by uniform _UV0Scale }
//
// GLASS            ( for glass like materials )
// TRANSPARENT      ( if you want to use alpha channel of albedo map )
//
// defines handeld by PbrMaterial:
//
// NO_LOD_EXTENSION ( fallback for devices that don't support lod extension )
// LDR_MAPS         ( fallback for devices that don't support float textures )
// NO_BDRF_LUT      ( don't use bdrf lut - use magic formula instead )
//

#ifndef NO_LOD_EXTENSION
#extension GL_EXT_shader_texture_lod : enable
#endif
#extension GL_OES_standard_derivatives : enable

#ifdef GLASS
	#ifndef TRANSPARENT
		#define TRANSPARENT 1
	#endif
#endif

precision mediump float;

varying vec3 vWorld;
varying vec2 vUV;

#ifdef USE_ALBEDO_VALUE
	uniform vec3 _Albedo;
#else
	uniform sampler2D _AlbedoMap;
#endif

#ifdef USE_ROUGHNESS
	#ifdef USE_ROUGHNESS_VALUE
		uniform float _Roughness;
	#else
		uniform sampler2D _RoughnessMap;
	#endif
#endif

#ifdef USE_METALLIC
	#ifdef USE_METALLIC_VALUE
		uniform float _Metallic;
	#else
		uniform sampler2D _MetallicMap;
	#endif
#endif

#ifdef USE_EMISSIVE
	#ifdef USE_EMISSIVE_VALUE
		uniform vec3 _Emissive;
	#else
		uniform sampler2D _EmissiveMap;
	#endif
#endif

#ifdef USE_NORMAL_MAP
	uniform sampler2D _NormalMap;
	#ifdef USE_TANGENTS
		varying mat3 vTBN;
	#else
		varying vec3 vWorldNormal;
	#endif
#else
	varying vec3 vWorldNormal;
#endif

#ifdef USE_AO_MAP
	uniform sampler2D _AOMap;
#endif

#ifdef USE_UV1_FOR_AO_MAP
	varying vec2 vUV1;
#endif

uniform float _MaxLod;

#ifndef NO_BDRF_LUT
	uniform sampler2D _brdfLUT;
#endif

uniform samplerCube _IrradianceMap;
uniform samplerCube _PrefilterMap;

#ifdef NO_LOD_EXTENSION
	uniform samplerCube _PrefilterMapMapLow;
#endif

uniform vec3 _CamPos;

// material params
uniform float _Exposure;


const float PI = 3.14159265359;

vec3 ModifiedFresnel(float cosTheta, vec3 F0, float roughness) {
	return F0 + (max(vec3(1.-roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);
}

vec3 getNormal() {
#ifdef USE_NORMAL_MAP
	vec3 tl = texture2D(_NormalMap, vUV).xyz;

	vec3 nm = tl * 2. - 1.;

	#ifdef USE_TANGENTS
		return normalize(vTBN * nm);
	#else
		//compute tangents in fs
		vec3 Q1  = dFdx(vWorld);
		vec3 Q2  = dFdy(vWorld);
		vec2 st1 = dFdx(vUV);
		vec2 st2 = dFdy(vUV);

		vec3 normal   = normalize(vWorldNormal);
		vec3 tangent  = normalize(Q1*st2.t - Q2*st1.t);
		vec3 binormal = -normalize(cross( normal, tangent));
		mat3 TBN      = mat3(tangent, binormal, normal);

		//normalize should not be needed, but without it, artifacts are introduced
		return normalize(TBN * nm);
	#endif
#else
	return normalize(vWorldNormal);
#endif
}

vec3 cubeMapLookupLodLerp(samplerCube s, vec3 N, float lod, samplerCube sl) {
#ifdef NO_LOD_EXTENSION
	vec3 high = textureCube(s, N).rgb;
	vec3 low =  textureCube(sl, N).rgb;
	vec3 verylow =  textureCube(_IrradianceMap, N).rgb;
	return mix( mix( high, low, clamp(lod, 0., 1.) ), verylow, max(0.,lod-1.)/(_MaxLod-1.));
#else
	return textureCubeLodEXT(s, N, lod).rgb;
#endif
}

vec3 cubeMapLookup(samplerCube s, vec3 N) {
#ifdef NO_LOD_EXTENSION
	return textureCube(s, N).rgb;
#else
	return textureCubeLodEXT(s, N, 0.0).rgb;
#endif
}

vec3 getSpecularLightColor( vec3 N, float lod ) {
#ifdef NO_LOD_EXTENSION
	vec3 color = cubeMapLookupLodLerp(_PrefilterMap, N,  lod, _PrefilterMapMapLow).rgb;
#else
	vec3 color = textureCubeLodEXT(_PrefilterMap, N,  lod).rgb;
#endif

#ifdef LDR_MAPS
	color = color * color * color * color * 8.;
#endif
	return color;
}

vec3 getDiffuseLightColor( vec3 N ) {
	vec3 color = cubeMapLookup(_IrradianceMap, N).rgb;
#ifdef LDR_MAPS
	color = color * color * color * color * 8.;
#endif
	return color;
}

void main()
{
#ifdef USE_ALBEDO_VALUE
	vec3 albedo = pow(_Albedo, vec3(2.2));
	float alpha = 1.;
#else
	#ifdef TRANSPARENT
		vec4 albedoLookup = texture2D(_AlbedoMap, vUV);
		vec3 albedo = pow(albedoLookup.rgb, vec3(2.2));
		float alpha = albedoLookup.a;
	#else
		vec3 albedo = pow(texture2D(_AlbedoMap, vUV).rgb, vec3(2.2));
	#endif
#endif

#ifdef USE_ROUGHNESS
	#ifdef USE_ROUGHNESS_VALUE
		float roughness = _Roughness;
	#else
		float roughness = texture2D(_RoughnessMap, vUV).r;
	#endif
#else
	float roughness = 0.;
#endif

#ifdef USE_METALLIC
	#ifdef USE_METALLIC_VALUE
		float metallic = _Metallic;
	#else
		float metallic = texture2D(_MetallicMap, vUV).r;
	#endif
#else
	float metallic = 0.;
#endif

#ifdef USE_EMISSIVE
	#ifdef USE_EMISSIVE_VALUE
		vec3 EMISSIVE = _Emissive;
	#else
		float emissive = texture2D(_EmissiveMap, vUV).r;
	#endif
#else
	float emissive = 0.;
#endif

#ifdef USE_AO_MAP
	#ifdef USE_UV1_FOR_AO_MAP
		float ao = texture2D(_AOMap, vUV1).r;
	#else
		float ao = texture2D(_AOMap, vUV).r;
	#endif
#endif


	// calculate lighting params
	vec3 N      = getNormal();
	vec3 V      = normalize(_CamPos - vWorld); // vector to eye in world space
	vec3 R      = reflect(-V, N);
	float NdotV = max(0.0, dot(N, V));

	vec3 F0 = vec3(0.04); // base average for almost all dia-electrics
	F0 = mix(F0, albedo, metallic);


	vec3 F = ModifiedFresnel(NdotV, F0, roughness);

	vec3 kS = F;

	vec3 prefilteredColor = getSpecularLightColor(R,  roughness * _MaxLod).rgb;

#ifdef NO_BDRF_LUT
	const vec2 envBRDF = vec2(1., 0.);
#else
	vec2 envBRDF          = texture2D(_brdfLUT, vec2(NdotV, roughness)).rg;
#endif
	vec3 specular         = prefilteredColor * (F * envBRDF.x + envBRDF.y);

	vec3 kD = vec3(1.0) - kS;

	kD *= 1.0 - metallic;

	vec3 irradiance = getDiffuseLightColor(N).rgb;

	vec3 diffuse  = albedo * irradiance;

	vec3 color = kD * diffuse + specular;


#ifdef GLASS
	alpha *= kS.x;
	color = kD * diffuse * alpha + specular;
#endif

#ifdef USE_AO_MAP
	color *= ao;
#endif

#ifdef USE_EMISSIVE
	color += emissive;
#endif

#ifndef HDR_OUTPUT
	color *= _Exposure;
	color = max( vec3(0), color - 0.004);
	color = (color*(6.2*color + .5)) / (color*(6.2*color+1.7) + 0.06);
#endif

#ifdef TRANSPARENT
	// outputs premultiplied alpha
	#ifdef GLASS
		gl_FragColor = vec4(color, alpha);
	#else
		gl_FragColor = vec4(color * alpha, alpha);
	#endif
#else
	gl_FragColor = vec4(color, 1.);
#endif
	//gl_FragColor = vec4(N * 0.5 + 0.5, 1.);
}