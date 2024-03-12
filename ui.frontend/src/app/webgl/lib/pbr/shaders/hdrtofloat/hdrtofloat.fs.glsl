precision highp float;


uniform sampler2D uTexture;

varying vec2 vUV;

void main(void) {
	vec4 col = texture2D( uTexture, vUV );
	float e = col.a;

	gl_FragColor = vec4(col.rgb * exp2( e* 255. - 128. ), 1.);
}