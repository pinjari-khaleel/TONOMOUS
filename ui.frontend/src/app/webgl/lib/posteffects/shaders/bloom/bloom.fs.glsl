precision mediump float;

varying vec2 vUV;

varying vec2 vUV1;
varying vec2 vUV2;
varying vec2 vUV3;
varying vec2 vUV4;

uniform sampler2D uTexture;
uniform float _PassBoost;

#ifdef LAST_PASS
	uniform sampler2D uSource;
	uniform highp float uTime;
	uniform float _NoiseAmount;

	float hash12(highp vec2 p)
    {
    	vec3 p3  = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }
#endif

#ifdef FIRST_PASS
	uniform float _Threshold;
	uniform float _Strength;

	#ifdef ALPHA_AS_EMISSIVE
		vec3 prefilter (in vec4 c) {
			float brightness = max(c.r, max(c.g, c.b));
			//emissive
			brightness += c.w;
			float contribution = max(0., brightness - _Threshold);
			c.xyz *= (contribution * _Strength * _Strength);
			return c.xyz;
    	}
	#else
		vec3 prefilter (in vec3 c) {
			float brightness = max(c.r, max(c.g, c.b));
			float contribution = max(0., brightness - _Threshold);
			return c * (contribution * _Strength * _Strength);
			//return normalize(c) * (contribution * _Strength * _Strength);
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
	vec3 s = ts(vUV1) + ts(vUV2) + ts(vUV3) + ts(vUV4);

	#ifdef LAST_PASS
		gl_FragColor.xyz = s * 0.25;
		gl_FragColor.xyz += texture2D(uSource, vUV).xyz;
		gl_FragColor.xyz += (hash12(gl_FragCoord.xy) - 0.5) * _NoiseAmount;
		gl_FragColor.xyz = clamp(gl_FragColor.xyz, 0., 1.);
	#else
		gl_FragColor.xyz = s * (0.25 * (1. + _PassBoost));
	#endif
	gl_FragColor.w = 1.;
}
