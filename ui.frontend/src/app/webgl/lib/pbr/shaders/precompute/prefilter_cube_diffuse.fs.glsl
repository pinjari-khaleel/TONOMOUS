#extension GL_EXT_shader_texture_lod : enable

precision highp float;


varying vec3 vWorld;

uniform samplerCube  _CubeSampler;

const float PI = 3.14159265359;

#define HASHSCALE3 vec3(443.897, 441.423, 437.195)

vec2 hash21(float p)
{
	vec3 p3 = fract(vec3(p) * HASHSCALE3);
	p3 += dot(p3, p3.yzx + 19.19);
	return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}

float hash13(vec3 p3)
{
	p3  = fract(p3 * 443.8975);
	p3 += dot(p3, p3.yzx + 19.19);
	return fract((p3.x + p3.y) * p3.z);
}

vec3 cosWeightedRandomHemisphereDirection( const vec3 n, const float p ) {
	vec2 r = hash21(p);

	vec3 up = vec3(0,0,1);
	if( abs(n.z) > .99 ) up = vec3(1,0,0);
	vec3  uu = normalize( cross( n, up ) );
	vec3  vv = cross( uu, n );

	float ra = sqrt(r.y);
	float rx = ra*cos(6.2831*r.x);
	float ry = ra*sin(6.2831*r.x);
	float rz = sqrt( 1.0-r.y );
	vec3  rr = vec3( rx*uu + ry*vv + rz*n );

	return normalize( rr );
}

void main(void) {
	vec3 N = normalize(vWorld);

	vec3 irradiance = vec3(0.0);
	const int SAMPLE_COUNT = 1024 * 16;

	float offset = hash13(N+2.);
	for( int i=0; i<SAMPLE_COUNT; i++) {
		vec3 sampleVec = cosWeightedRandomHemisphereDirection( N, float(i)/float(SAMPLE_COUNT)+offset + 1. );

		irradiance += textureCubeLodEXT(_CubeSampler, sampleVec, 8.).rgb;
//  	irradiance += textureCube(_CubeSampler, sampleVec).rgb;
	}

	irradiance = irradiance * (1.0 / float(SAMPLE_COUNT));

//  make 'hdr format'.
	float m = max( max( irradiance.r, irradiance.g ), irradiance.b );
	float e = ceil(log2(m));

	irradiance /= exp2(e);

	gl_FragColor = vec4(irradiance, (e+128.)/255.);
}