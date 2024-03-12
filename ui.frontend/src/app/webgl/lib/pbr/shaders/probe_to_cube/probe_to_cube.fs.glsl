precision highp float;

varying vec2 vUV;

uniform highp sampler2D _Texture;

void main(void) {
	gl_FragColor = texture2D(_Texture, vUV);
}