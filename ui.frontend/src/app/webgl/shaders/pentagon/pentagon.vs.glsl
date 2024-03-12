precision mediump float;

attribute float aIndex;

varying vec2 vUV;

uniform vec2 _Points[5];
uniform float _SourceAspectRatio;
uniform float _AspectRatio;

void main(void) {
	int i = int(mod(aIndex, 5.));
	vUV = vec2(_Points[i].x, 1. - _Points[i].y);
	gl_Position = vec4(vUV * 2. - 1., 0.5, 1.);

  vUV -= .5;
  vUV *= _AspectRatio > _SourceAspectRatio ? vec2(1., _SourceAspectRatio / _AspectRatio) :  vec2(_AspectRatio / _SourceAspectRatio, 1.);
  vUV += .5;
}
