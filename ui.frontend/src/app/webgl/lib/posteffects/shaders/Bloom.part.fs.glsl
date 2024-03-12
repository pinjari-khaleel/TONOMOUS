	uniform sampler2D _BloomSource;

 vec3 bloom(vec2 uv, vec3 color) {
 	color = texture2D(uTexture, vUV).xyz;
 	return color + texture2D(_BloomSource, vUV).xyz;
 }