precision highp float;


varying vec2 vUV;

const float PI = 3.14159265359;

// see: http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
float PartialGeometryGGX(float NdotV, float a)
{
	float k = a / 2.0;

	float nominator   = NdotV;
	float denominator = NdotV * (1.0 - k) + k;

	return nominator / denominator;
}

// NOTE(Joey): smith approximation of geometry term w/
// two partial approximations based on L and V direction.
float GeometryGGX_Smith(float NdotV, float NdotL, float roughness)
{
		float a = roughness*roughness;
		float G1 = PartialGeometryGGX(NdotV, a);
		float G2 = PartialGeometryGGX(NdotL, a);
		return G1 * G2;
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

// NOTE(Joey): generate pseudo-random samples on hemisphere for Quasi Monte Carlo
// integration; see: http://holger.dammertz.org/stuff/notes_HammersleyOnHemisphere.html
vec3 ImportanceSampleGGX(vec2 Xi, float roughness)
{
	float a = roughness*roughness;
	float phi      = 2.0 * PI * Xi.x;
	float cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a*a - 1.0) * Xi.y));
	float sinTheta = sqrt(1.0 - cosTheta*cosTheta);

		// NOTE(Joey): generate half vector in tangent space
	vec3 HTangent;
	HTangent.x = sinTheta*cos(phi);
	HTangent.y = sinTheta*sin(phi);
	HTangent.z = cosTheta;

	return HTangent;
}
vec2 hash21(float p)
{
	vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
	p3 += dot(p3, p3.yzx + 19.19);
	return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}


vec2 IntegrateBRDF(float roughness, float NdotV)
{
	vec3 V;
	V.x = sqrt(1.0 - NdotV*NdotV);
	V.y = 0.0;
	V.z = NdotV;

	float A = 0.0;
	float B = 0.0;

	const int SAMPLE_COUNT = 1024;

	vec3 N = vec3(0.0, 0.0, 1.0);
	vec3 UpVector = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0); // NOTE(Joey): creates ugly circle sphere at center when switched to (1.0, 0.0, 0.0)
	vec3 TangentX = normalize(cross(UpVector, N));
	vec3 TangentY = cross(N, TangentX);

	// NOTE(Joey): for debugging, make scope visible to end part
	for(int i = 0; i < SAMPLE_COUNT; ++i)
	{
		// NOTE(Joey): generates a sample vector that's biased towards the
		// preferred alignment direction (importance sampling).
		vec2 Xi = Hammersley(i, SAMPLE_COUNT);
		vec3 HTangent = ImportanceSampleGGX(Xi, roughness);
		// NOTE(Joey): convert from tangent to world-space
		vec3 H = normalize(HTangent.x * TangentX + HTangent.y * TangentY + HTangent.z * N);
		vec3 L = normalize(2.0 * dot(V, H) * H - V);

		float NdotL = max(L.z, 0.0);
		float NdotH = max(H.z, 0.0);
		float VdotH = max(dot(V, H), 0.0);

		if(NdotL > 0.0)
		{
			float G = GeometryGGX_Smith(NdotV, NdotL, roughness);
			float G_Vis = (G * VdotH) / (NdotH * NdotV);
			float Fc = pow(1.0 - VdotH, 5.0);

			A += (1.0 - Fc) * G_Vis;
			B += Fc * G_Vis;
		}
	}
	A /= float(SAMPLE_COUNT);
	B /= float(SAMPLE_COUNT);
	return vec2(A, B);
}

void main(void) {
	vec2 integratedBRDF = IntegrateBRDF(vUV.y, vUV.x);

	gl_FragColor = vec4(integratedBRDF, 0.0, 1.0);
//	gl_FragColor = vec4(integratedBRDF.xy, radicalInverse(int(vUV.x * 10.0)), 1.0); // NOTE(Joey): test Hammersley sequence
}