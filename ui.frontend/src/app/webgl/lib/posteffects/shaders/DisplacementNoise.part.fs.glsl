uniform float _Disp_Scale;
uniform float _Disp_Strength;
uniform float _Disp_Speed;

uniform sampler2D _DisplacementTex;
uniform vec2 _DisplacementTexSize;


vec3 displacementnoise(vec2 uv, vec3 color) {

	vec2 displacementUV = uv * _Disp_Scale + uTime *_Disp_Speed;// floor(uTime *_DisplacementSpeed * 10.0) * 0.5;;//
	vec2 displacement = (texture2D(_DisplacementTex, displacementUV).rg);// + texture2D(_DisplacementTex, displacementUV * vec2(-0.3, -0.5)).rg;
	displacement = floor(displacement * 5.0) / 5.0;
	displacement = displacement * 2.0 - 1.0;

	vec2 posFromCenter = uv - 0.5;
	float distanceFromCenter = sqrt(posFromCenter.x * posFromCenter.x + posFromCenter.y * posFromCenter.y);

	float noiseStrength = 1.0 - smoothstep(0.08, 0.4, distanceFromCenter);
	noiseStrength = pow(noiseStrength, 2.2);

	uv = uv + displacement * _Disp_Strength * noiseStrength;
	color = texture2D(uTexture, uv).rgb;

	return max(vec3(0), color);
}