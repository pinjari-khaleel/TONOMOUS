#extension GL_EXT_shader_texture_lod : enable

precision highp float;


varying vec3 vWorld;

uniform samplerCube  _CubeSampler;
uniform float _Roughness;
uniform float _MaxBackgroundLod;
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


vec3 ImportanceSampleGGX(vec2 vXi, vec3 vNormal, float fRoughness)
{
	// Compute the local half vector
	float fA = fRoughness * fRoughness;
	float fPhi = 2.0 * PI * vXi.x;
	float fCosTheta = sqrt((1.0 - vXi.y) / (1.0 + (fA*fA - 1.0) * vXi.y));
	float fSinTheta = sqrt(1.0 - fCosTheta * fCosTheta);
	vec3 vHalf;
	vHalf.x = fSinTheta * cos(fPhi);
	vHalf.y = fSinTheta * sin(fPhi);
	vHalf.z = fCosTheta;

	// Tangent to world space
	return vHalf;
}


// NOTE(Joey): different implementation of radical inverse (radical
// as the adjetive of radix/base) using mod operations as bit
// operations aren't allowed in GLSL ES 2.0.
// NOTE(Joey): also known as Van der Corput sequence
float radicalInverse(int n)
{
	int   base    = 2;
	float invBase = 1.0 / float(base);
	float denom   = 1.0;
	float result  = 0.0;

	// NOTE(Joey): do this for all 32 bits; doesn't work with
	// while loop. This produces a lot of wasted cycles but
	// difficult to do otherwise in ES 2.0.
	for(int i = 0; i < 32; ++i)
	{
		if(n > 0)
		{
			denom   = mod(float(n), 2.0);
			result += denom * invBase;
			invBase = invBase / 2.0;
			n       = int(float(n) / 2.0);
		}
	}

	return result;
}

vec2 Hammersley(int i, int sampleCount)
{
	return vec2(float(i)/float(sampleCount), radicalInverse(i));
}


float D_GGX_Divide_Pi ( float NdotH , float m ) {
	float m2 = m * m ;
	float f = ( NdotH * m2 - NdotH ) * NdotH + 1.;
	return m2 / (f * f * PI) ;
}


// todo: zie https://placeholderart.wordpress.com/2015/07/28/implementation-notes-runtime-environment-map-filtering-for-image-based-lighting/
void main(void) {
	// NOTE(Joey): the world vector acts as the normal of a tangent surface
	// from the origin, aligned to vWorld. Given this normal, calculate all
	// incoming radiance of the environment.
	vec3 N = normalize(vWorld);
	// NOTE(Joey): approximate view/reflection angle as equal to N (Unreal; split-sum)
	vec3 R = N;
	vec3 V = N;

	const int SAMPLE_COUNT = 1024 * 4; // * 8
	vec3 prefilteredColor = vec3(0.0);
	float totalWeight = 0.;

	// Compute a tangent frame and rotate the half vector to world space
	vec3 vUp = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
	vec3 vTangentX = normalize(cross(vUp, N));
	vec3 vTangentY = cross(N, vTangentX);

	float offset = hash13( N + 2. );

	// NOTE(Joey): for debugging, make scope visible to end part
	for(int i = 0; i < SAMPLE_COUNT; ++i)
	{
		vec3 L = cosWeightedRandomHemisphereDirection( N, offset + float(i) );
		L = mix( L, N, 0.99 );

		prefilteredColor += textureCube(_CubeSampler, L).rgb;

		totalWeight      += 1.;
	}

	prefilteredColor = prefilteredColor / totalWeight;

	vec3 color = max( vec3(0), prefilteredColor - 0.004);
	color = (color*(6.2*color + .5)) / (color*(6.2*color+1.7) + 0.06);

	gl_FragColor = vec4(color, 1.);
}