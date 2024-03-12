precision mediump float;

varying vec2 vUV;

uniform sampler2D _Texture;

void main(void) {
	gl_FragColor = texture2D(_Texture, vUV);
}