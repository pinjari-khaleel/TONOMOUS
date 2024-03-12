precision highp float;


uniform sampler2D uTexture;

varying vec2 vUV;

void main(void) {
	vec4 col = texture2D( uTexture, vUV );
	float e = col.a;

	vec3 hdr = col.rgb * exp2( e* 255. - 128. );

	// map to 0-1
	vec3 ldr = pow(hdr*.125, vec3(1./4.));

	gl_FragColor = vec4(ldr, 1.);
}