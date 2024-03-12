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

uniform sampler2D uTexture;
uniform highp float _PixelCount;
uniform highp float _AspectRatio;
uniform highp float _SourceAspectRatio;
uniform float _Brightness;
uniform float _Lod;

void main(void) {
//	vec2 df = vec2(dFdx(vUV.x), dFdy(vUV.y));
//	vec2 res = (vec2(1.) / df) * 0.01;

//	vec2 res = vec2(_PixelCount, _PixelCount / _AspectRatio);
	vec2 res = vec2(_PixelCount);
	res *= _AspectRatio > _SourceAspectRatio ? vec2(_AspectRatio, _AspectRatio/ _SourceAspectRatio) :  vec2( _SourceAspectRatio, 1.);

	vec2 uv = floor(vUV * res + .5) / res;

	#ifdef WEBGL2
	vec3 c = textureLod(uTexture, uv, _Lod).xyz;
	#else
	vec3 c = texture2DLodEXT(uTexture, uv, _Lod).xyz;
	#endif

  fragColor = vec4(c * _Brightness, 1.);
}
