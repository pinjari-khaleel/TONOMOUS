uniform float _SmokeEdgeStrength;
uniform sampler2D _SmokeEdgeTex;

vec3 smokeedge(vec2 uv, vec3 color) {
	vec2 q = uv;
	float alpha = 1.0 - pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.2);

	vec2 p = uv - .5;
	float a = atan(p.y,p.x)  * (1./3.1415927);
	float r = length(p);
	uv = vec2( 0.3/r + 0.01*uTime + a, a ) * vec2(1., 2.);
	uv += .5 * texture2D(_SmokeEdgeTex, uv + .01 * uTime).rg;
	uv += .5 * texture2D(_SmokeEdgeTex, uv - .02 * uTime).ga;
	float n = max(0., texture2D(_SmokeEdgeTex, uv).r - .2);

	color += min(n * n * pow(alpha, 1.5) * .8, .5) * _SmokeEdgeStrength;

	return color;
}