#extension GL_EXT_shader_texture_lod : enable

#ifdef GL_ES
	precision highp float;
#endif

varying vec3 vWorld;

uniform samplerCube  _CubeSampler;
uniform float _Roughness;
uniform float _MaxBackgroundLod;
uniform float _SourceDim;

#define PI 3.14159265359
#define GOLDEN_ANGLE 2.39996322;
#define HASHSCALE3 vec3(443.897, 441.423, 437.195)

float hash13(vec3 p3)
{
	p3  = fract(p3 * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

//http://www.rorydriscoll.com/2009/01/07/better-sampling/

//biased concentration towards centre
vec3 FibonacciImportanceSample (float i, float sampleCount, float roughness, float rotationOffset){
	float phase = i / sampleCount;
    float a = roughness * roughness;
    //TODO; understand this
    float z = sqrt((1. - phase) / (1. + (a*a - 1.) *phase));
    float r = sqrt(1. - z * z);
    float phi = i * GOLDEN_ANGLE;
    phi += rotationOffset;
	return vec3(sin(phi) * r, cos(phi) * r, z);
}

float D_GGX_Divide_Pi ( float NdotH , float m ) {
    float m2 = m * m ;
    float f = ( NdotH * m2 - NdotH ) * NdotH + 1.;
    return m2 / (f * f * PI) ;
}

//https://placeholderart.wordpress.com/2015/07/28/implementation-notes-runtime-environment-map-filtering-for-image-based-lighting/
//https://learnopengl.com/PBR/IBL/Specular-IBL
void main(void) {
    vec3 N = normalize(vWorld);

    //on win7 it worked @ 2k samples, but crashes @512 on win 10
    const float SAMPLE_COUNT = 256.;
    vec3 prefilteredColor = vec3(0.0);
    float totalWeight = 0.;

    // Compute a tangent frame and rotate the half vector to world space
    vec3 vUp = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 vTangentX = normalize(cross(vUp, N));
    vec3 vTangentY = cross(N, vTangentX);
    mat3 tangentToWorld = mat3(vTangentX, vTangentY, N );

	 float saTexel = 4.0 * 3.14159265359 / (6.0 * _SourceDim * _SourceDim);

    float rotationOffset = hash13(N) * PI * 2.;

    for(float i = 0.; i < SAMPLE_COUNT; ++i)
    {

		float weight = 1.;

	  	vec3 hemisphere = FibonacciImportanceSample(i,SAMPLE_COUNT,_Roughness, rotationOffset);

       if(_Roughness == 0.){
            hemisphere = vec3(0,0,1);
       }

		vec3 L = tangentToWorld * hemisphere;
		//not sure if this should be here; it is already importance sampled
        weight *= hemisphere.z;

        if(weight > 0.0) {
            float NdotH = hemisphere.z;
            float D = D_GGX_Divide_Pi ( NdotH , _Roughness );
            float pdf = (D * NdotH / (4. * NdotH)) + 0.0001;

            //increase this number for more sharpness
            //replaces SAMPLE_COUNT with a hardcoded value, because it looked way to blurry with a low sample count
            float saSample = 1.0 / (1024. * pdf + 0.00001);

			//when sampling pattern is very clear, increase miplevel a bit (0.75 to 1)

			//from original article
			float mipBias = 1.0;

			//use value = 0.5 when not importance sampling
			//when using importance sampling, this number should be heightened (0.75)
			float mipLevel = max(0.65 * log2(saSample / saTexel) + mipBias, 0.0);
			if(_Roughness == 0.0)mipLevel = 0.;

            prefilteredColor += textureCubeLodEXT(_CubeSampler, L, mipLevel).rgb * weight;

            totalWeight      += weight;
        }
    }

    prefilteredColor = prefilteredColor / totalWeight;

//  make 'hdr format'.
    float m = max( max( prefilteredColor.r, prefilteredColor.g ), prefilteredColor.b );
    float e = ceil(log2(m));

    prefilteredColor /= exp2(e);

    gl_FragColor = vec4(prefilteredColor, (e+128.)/255.);
}