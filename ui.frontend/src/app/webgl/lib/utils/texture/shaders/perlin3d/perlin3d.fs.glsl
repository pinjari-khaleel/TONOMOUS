precision mediump float;

varying vec2 vUV;

uniform float _Frequency;
uniform float _Falloff;

// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float gradientNoise( in vec3 p )
{
	vec3 i = floor( p );
	vec3 f = fract( p );
	vec3 u = f*f*(3.0-2.0*f);

	//TODO: 3d
	return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
					 dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
				mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
					 dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 octaves(vec3 uv)
{
	const mat3 m = mat3( 0.00,  0.80,  0.60,
						-0.80,  0.36, -0.48,
						-0.60, -0.48,  0.64 );
	float a = 1.;
	vec3 sum = vec3(0.);

	for(int i = 0; i< OCTAVES; i++){
		sum.x += gradientNoise( uv ) * a;
		sum.y += gradientNoise( uv + 123.56) * a;
		sum.z += gradientNoise( uv + 567.78) * a;
		uv = m*uv;
		a *= _Falloff;
	}

	return 0.5 * sum + 0.5;
}

void main(void) {
	vec3 c = octaves(vec3(vUV * _Frequency, _Time));
	gl_FragColor = vec4(c, 1.);
}