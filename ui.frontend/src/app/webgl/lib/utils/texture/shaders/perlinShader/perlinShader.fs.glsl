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

float gradientNoise( in vec2 p )
{
	vec2 i = floor( p );
	vec2 f = fract( p );
	vec2 u = f*f*(3.0-2.0*f);

	return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
					 dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
				mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
					 dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 octaves(vec2 uv)
{
	//TODO: incorporate falloff
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
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
	vec3 c = octaves(vUV * _Frequency);
	gl_FragColor = vec4(c, 1.);
}