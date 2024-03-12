precision mediump float;

varying vec2 vUV;

uniform sampler2D uTexture;
uniform vec2 _BloomSourceTexelSize;
uniform float _BloomThreshold;
uniform float _PassBoost;
uniform float _BloomStrength;

uniform sampler2D uTexture;
uniform float _PassBoost;

#ifdef FIRST_PASS
	uniform float _BloomThreshold;
	uniform float _BloomStrength;

	#ifdef ALPHA_AS_EMISSIVE
		vec3 prefilter (in vec4 c) {
    		float brightness = max(c.r, max(c.g, c.b));
    		//emissive
    		brightness += c.w;
    		float contribution = max(0., brightness - _BloomThreshold);
    		c.xyz *= (contribution * _BloomStrength * _BloomStrength);
    		return c.xyz;
    	}
	#else
		vec3 prefilter (in vec3 c) {
    		float brightness = max(c.r, max(c.g, c.b));
    		float contribution = max(0., brightness - _BloomThreshold);
    		contribution /= (1. - _BloomThreshold);
    		c *= (contribution * _BloomStrength * _BloomStrength);
    		return c;
    	}
	#endif
#endif

vec3 ts(in vec2 uv) {
	#ifdef FIRST_PASS
		#ifdef ALPHA_AS_EMISSIVE
			return prefilter(texture2D(uTexture, uv));
		#else
			return prefilter(texture2D(uTexture, uv).xyz);
		#endif


	#else
		return texture2D(uTexture, uv).xyz;
	#endif
}

void main(void) {
	vec4 o = _BloomSourceTexelSize.xyxy * vec2(-1., 1.).xxyy;
	vec3 s = ts(vUV + o.xy) + ts(vUV + o.zy) + ts(vUV + o.xw) + ts(vUV + o.zw);

	gl_FragColor.xyz = s * (0.25 * (1. + _PassBoost));
	gl_FragColor.w = 1.;
}

