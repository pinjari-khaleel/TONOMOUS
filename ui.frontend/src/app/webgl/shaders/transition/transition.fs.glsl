precision mediump float;

#ifdef WEBGL2
#version 300 es
	layout(location = 0) out vec4 fragColor;
	in vec2 vUV;
#else
	#define texture(s,uv) texture2D(s, uv)
	#define fragColor gl_FragColor
	varying vec2 vUV;
#endif

uniform sampler2D _SourceA;
uniform sampler2D _SourceB;
uniform float _PixelCount;
uniform float _AspectRatio;
uniform float _MaskProgress;
uniform float _MaskRange;
uniform float _Time;
uniform float _ShiftAmp;
uniform vec2 _MouseVel;
uniform vec2 _MousePos;
uniform float _Posterize;

vec4 hash41(float p)
{
	vec4 p4 = fract(vec4(p) * vec4(.1031, .1030, .0973, .1099));
	p4 += dot(p4, p4.wzxy+33.33);
	return fract((p4.xxyz+p4.yzzw)*p4.zywx);
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

float getMask(vec2 uv){
	uv.x = floor(uv.x * _PixelCount);
	vec4 h = hash41(uv.x);
	float phase = uv.y + h.x * _MaskRange;
	float f = (.25 + h.y) * 10.;
	phase += (sin( uv.y * f + 6.28 * h.z) + 1.) * h.w * _MaskRange;
	return step(0., _MaskProgress * (1. + _MaskRange * 3. + 0.01) - phase);
}

vec2 mouseInteraction(vec2 uv) {
  // 5= groote blokjes
  // 4= radius circle
  // 100 = effect grootte
  vec2 res = vec2(_PixelCount / 6.0, _PixelCount / 2.0);
  res.x *= _AspectRatio;

//  res *= _AspectRatio > 1. ? vec2(_AspectRatio, _AspectRatio/ 1.) :  vec2( 1., 1.);

  vec2 uvi = floor(uv * res + .5) / res;
  uvi.x *= _AspectRatio;

  vec2 mousePos = _MousePos;
  mousePos.x *= _AspectRatio;
  mousePos.y = 1.0 - mousePos.y;

  float dist = smoothstep(.25, 0., distance(uvi, mousePos)) * _ShiftAmp;

  uv += _MouseVel * dist;

  return uv;
}

void main(void) {
  vec2 uv = mouseInteraction(vUV);

  vec3 c = texture(_SourceB, uv).xyz;
  if(_MaskProgress < 1.){
    vec3 a = texture(_SourceA, vUV).xyz;
    c = mix(a, c, getMask(vUV));
  }


	fragColor = vec4(c, 1.);
}
