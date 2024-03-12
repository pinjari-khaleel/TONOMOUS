attribute vec3 aPos;
attribute vec2 aUV0;

varying vec2 vUV;

varying vec2 vUV1;
varying vec2 vUV2;
varying vec2 vUV3;
varying vec2 vUV4;

uniform vec2 _SourceTexelSize;
uniform float _RotateSample;

void main(void) {
	vUV = aUV0;

/*	vec4 o = _BloomSourceTexelSize.xyxy * vec2(-1., 1.).xxyy;
	vUV1 = vUV + o.xy;
	vUV2 = vUV + o.zy;
	vUV3 = vUV + o.xw;
	vUV4 = vUV + o.zw;*/

	vUV1 = vUV + vec2(-1., -1.) * _SourceTexelSize;
	vUV2 = vUV + vec2(1., -1.) * _SourceTexelSize;
	vUV3 = vUV + vec2(-1., 1.) * _SourceTexelSize;
	vUV4 = vUV + vec2(1., 1.) * _SourceTexelSize;

	//minimizes aliasing on straight lines
	vUV1 += vec2(-1., 1.) * _SourceTexelSize * _RotateSample;
	vUV2 += vec2(-1., -1.) * _SourceTexelSize * _RotateSample;
	vUV3 += vec2(1., 1.) * _SourceTexelSize * _RotateSample;
	vUV4 += vec2(1., -1.) * _SourceTexelSize * _RotateSample;

	gl_Position = vec4(aPos, 1.0);
}
