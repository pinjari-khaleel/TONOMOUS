attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec2 aUV0;

#ifdef USE_UV1_FOR_AO_MAP
	attribute vec2 aUV1;
	varying vec2 vUV1;
#endif

#ifdef USE_NORMAL_MAP
	#ifdef USE_TANGENTS
		attribute vec4 aTangent;
		varying mat3 vTBN;
	#else
		varying vec3 vWorldNormal;
	#endif
#else
	varying vec3 vWorldNormal;
#endif

uniform mat4 _ViewProjection;
uniform mat4 _Model;

#ifdef SCALE_UV0
	uniform float _UV0Scale;
#endif
#ifdef SKINNED_MATRICES
attribute vec4 aSkinIndex;
attribute vec4 aSkinWeight;
#endif

varying vec2 vUV;
varying vec3 vWorld;

#ifdef SKINNED_MATRICES
	#ifdef SKINNED_MATRICES_TEXTURE
	uniform sampler2D _BoneTexture;
	uniform float _BoneTextureWidth;
	uniform float _BoneTextureHeight;

	mat4 getBoneMatrix( const in float i ) {

		float j = i * 4.0;
		float x = mod( j,  _BoneTextureWidth );
		float y = floor( j / _BoneTextureWidth );

		float dx = 1.0 / _BoneTextureWidth;
		float dy = 1.0 / _BoneTextureHeight;

		y = dy * ( y + 0.5 );

		vec4 v1 = texture2D( _BoneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( _BoneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( _BoneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( _BoneTexture, vec2( dx * ( x + 3.5 ), y ) );

		return mat4( v1, v2, v3, v4 );
	}
	#else
	uniform mat4 _BoneMatrices[64];
	mat4 getBoneMatrix( const in float i ) {
		return _BoneMatrices[int(i)];
	}
	#endif
#endif

void main(void) {
	vec4 pos;
	vec3 normal;

#ifdef SKINNED_MATRICES
	mat4 skinMatrix = mat4(0.0);
		skinMatrix += aSkinWeight.x * getBoneMatrix(aSkinIndex.x);
		skinMatrix += aSkinWeight.y * getBoneMatrix(aSkinIndex.y);
		skinMatrix += aSkinWeight.z * getBoneMatrix(aSkinIndex.z);
		skinMatrix += aSkinWeight.w * getBoneMatrix(aSkinIndex.w);

	pos = skinMatrix * vec4(aPos, 1.0);
	normal = vec4(skinMatrix * vec4(aNormal, 0.0)).xyz;
#else
	pos = vec4(aPos, 1.0);
	normal = aNormal;
#endif

	vec4 world = _Model * pos;
	vWorld = world.xyz;

	#ifdef USE_NORMAL_MAP
	   #ifdef USE_TANGENTS
		   vec3 tangent;
		   #ifdef SKINNED_MATRICES
				tangent = vec4(skinMatrix * vec4(aTangent.xyz, 0.0)).xyz;
		   #else
			   tangent = aTangent.xyz;
		   #endif
		   vec3 B = normalize(cross( tangent.xyz, normal));
		   B *= aTangent.w;
		   vTBN = mat3(tangent.xyz, B, normal);
		   //TODO: mat3(_Model) can go wrong with very extreme scales

		   vTBN = mat3(_Model) * vTBN;
	   #else
		  vWorldNormal = mat3(_Model) * normal;
	   #endif
	#else
		vWorldNormal = mat3(_Model) * normal;
	#endif

	vUV = aUV0;

	#ifdef USE_UV1_FOR_AO_MAP
		vUV1 = aUV1;
	#endif

	#ifdef SCALE_UV0
		vUV *= _UV0Scale;
	#endif

	gl_Position = _ViewProjection * world;
}
