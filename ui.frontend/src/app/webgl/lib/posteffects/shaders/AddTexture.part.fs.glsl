uniform float _AddTextureOffset;
uniform float _AddTextureScale;
uniform float _AddTextureStrength;

uniform sampler2D _AddTextureTex;
uniform vec2 _AddTextureTexSize;

vec3 addtexture(vec2 uv, vec3 color) {
	uv = gl_FragCoord.xy * (_AddTextureScale / _AddTextureTexSize);
	color += texture2D(_AddTextureTex, uv).rgb * _AddTextureStrength + _AddTextureOffset;

	return max(vec3(0), color);
}