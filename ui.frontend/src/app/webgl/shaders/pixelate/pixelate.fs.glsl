precision mediump float;

#ifdef WEBGL2
#version 300 es
	layout(location = 0) out vec4 fragColor;
	in vec2 vUV;
#else
#extension GL_EXT_shader_texture_lod : enable
	#define texture(s,uv) texture2D(s, uv)
	#define fragColor gl_FragColor
	varying vec2 vUV;
#endif

uniform sampler2D _Photo;
uniform vec3 _GradientColors[3];
uniform float _PixelCount;
uniform float _PhotoOpacity;
uniform float _UsePhoto;
uniform highp float _AspectRatio;
uniform highp float _SourceAspectRatio;
uniform float _Brightness;
uniform float _Lod;
uniform float _Time;

uniform float _Amplitude;
uniform float _SpatialFrequency;
uniform float _TemporalFrequency;
uniform float _Time;
uniform float _Falloff;
uniform float _Twist;

#define m3 mat3(-0.7373, 0.4562, 0.4980, 0, -0.7373, 0.6754, 0.6754, 0.4980, 0.5437)
vec3 twistedSineNoise33(vec3 q)
{
	float a = 1.;
	vec3 sum = vec3(0);
	for(int i = 0; i <5 ; i++){
		q = m3 * q;
		vec3 s = sin( q.zxy / a) * a;
		q += s * _Twist;
		sum += s;
		a *= _Falloff;
	}
	return sum;
}

float hash11(float p)
{
	p = fract(p * .1031);
	p *= p + 33.33;
	p *= p + p;
	return fract(p);
}

vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
	p3 += dot(p3, p3.yzx+33.33);
	return fract((p3.xx+p3.yz)*p3.zy);
}

vec3 getGradient(){
	vec3 p = vec3(vUV * _SpatialFrequency, _Time * _TemporalFrequency);
	vec3 n = twistedSineNoise33(p) * _Amplitude;
	n = smoothstep(-1., 1., n);
  vec3 c = mix(_GradientColors[1], _GradientColors[2], n.x);
  c = mix(c, _GradientColors[0], n.y);
	return c;
}

void main(void) {
//	vec2 res = vec2(_PixelCount, _PixelCount / _AspectRatio);
  vec3 c = getGradient();

  if(_UsePhoto > .5){
    vec2 res = vec2(_PixelCount);
    res *= _AspectRatio > _SourceAspectRatio ? vec2(_AspectRatio, _AspectRatio/ _SourceAspectRatio) :  vec2( _SourceAspectRatio, 1.);
    vec2 uv = floor(vUV * res + .5) / res;
    #ifdef WEBGL2
    vec4 photo = textureLod(_Photo, uv, _Lod);
    #else
    vec4 photo = texture2DLodEXT(_Photo, uv, _Lod);
    #endif
    c = mix(c, photo.xyz, photo.w * _PhotoOpacity);
  }

	fragColor = vec4(c * _Brightness, 1.);
}
