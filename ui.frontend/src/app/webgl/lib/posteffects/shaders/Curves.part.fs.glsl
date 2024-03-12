uniform float _CurvesContrast;

uniform float _CurvesBlacks;
uniform float _CurvesShadows;
uniform float _CurvesMidtones;
uniform float _CurvesHighlights;
uniform float _CurvesWhites;

vec3 rgb_to_hcv(in vec3 RGB) {
//	RGB = saturate(RGB);
	float Epsilon = 1e-10;
	// Based on work by Sam Hocevar and Emil Persson
	vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
	vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
	float C = Q.x - min(Q.w, Q.y);
	float H = abs((Q.w - Q.y) / (6. * C + Epsilon) + Q.z);
	return vec3(H, C, Q.x);
}

vec3 rgb_to_hsl(in vec3 RGB) {
	vec3 HCV = rgb_to_hcv(RGB);
	float L = HCV.z - HCV.y * 0.5;
	float S = HCV.y / (1.0000001 - abs(L * 2.0 - 1.0));
	return vec3(HCV.x, S, L);
}

vec3 hsl_to_rgb(in vec3 HSL) {
//	HSL = saturate(HSL);
	vec3 RGB = vec3(abs(HSL.x * 6.0 - 3.0) - 1.0, 2.0 - abs(HSL.x * 6.0 - 2.0), 2.0 - abs(HSL.x * 6.0 - 4.0));
	float C = (1.0 - abs(2.0 * HSL.z - 1.0)) * HSL.y;
	return (RGB - 0.5) * C + HSL.z;
}
//
//float linearstep(float lower, float upper, float value) {
//	return saturate((value-lower)/(upper-lower));
//}

vec3 curves(in vec3 color) {
	vec3 hsl_color = rgb_to_hsl(color);
	float x = hsl_color.z;

	float blacks_mult     = smoothstep(0.25, 0.00, x);
	float shadows_mult    = smoothstep(0.00, 0.25, x) * smoothstep(0.50, 0.25, x);
	float midtones_mult   = smoothstep(0.25, 0.50, x) * smoothstep(0.75, 0.50, x);
	float highlights_mult = smoothstep(0.50, 0.75, x) * smoothstep(1.00, 0.75, x);
	float whites_mult     = smoothstep(0.75, 1.00, x);

	x = (	  blacks_mult * _CurvesBlacks
						+ shadows_mult * _CurvesShadows
						+ midtones_mult * _CurvesMidtones
						+ highlights_mult * _CurvesHighlights
						+ whites_mult * _CurvesWhites
						);

	color *= x;

	color = mix(color, color * color * (3. - 2. * color), _CurvesContrast);
	return color;
}

vec3 curves(vec2 uv, vec3 color) {
	color = clamp(color, vec3(0), vec3(1));

	color = curves(color);

	//	vec3 hsl_color = rgb_to_hsl(color.rgb);
	//	color.rgb = LIGHTROOM_GLOBAL_TEMPERATURE > 0 ? lerp(color.rgb, hsl_to_rgb(float3(0.06111, 1.0, hsl_color.z)), LIGHTROOM_GLOBAL_TEMPERATURE) : lerp(color.rgb, hsl_to_rgb(float3(0.56111, 1.0, hsl_color.z)), -LIGHTROOM_GLOBAL_TEMPERATURE);
	//	color.rgb = LIGHTROOM_GLOBAL_TEMPERATURE > 0 ? lerp(color.rgb, hsl_to_rgb(float3(0.31111, 1.0, hsl_color.z)), LIGHTROOM_GLOBAL_TINT) : lerp(color.rgb, hsl_to_rgb(float3(0.81111, 1.0, hsl_color.z)), -LIGHTROOM_GLOBAL_TINT);
	//	hsl_color = rgb_to_hsl(color.rgb);
	//
	//	hsl_color.y = saturate(hsl_color.y + hsl_color.y * LIGHTROOM_GLOBAL_SATURATION);
	//	hsl_color.y = pow(hsl_color.y,exp2(-LIGHTROOM_GLOBAL_VIBRANCE));
	//	hsl_color = saturate(hsl_color);

	return color;
}

