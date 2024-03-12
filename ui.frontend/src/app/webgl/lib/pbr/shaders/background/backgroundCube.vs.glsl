attribute vec3 aPos;

varying vec2 vUV;
varying vec3 vWorld;

uniform mat3 _View;
uniform mat3 _CameraRotation;
uniform mat4 _Projection;
uniform mat4 _ViewProjection;
uniform float _Farplane;
uniform vec3 _FrustumCorner;

void main(void) {
	gl_Position = vec4(aPos.xy, 0., 1.);

	vWorld = _CameraRotation * (vec3(aPos.xy,-1.) * _FrustumCorner);

/*	vec3 viewPos = _View * aPos;
	gl_Position = _Projection * vec4(viewPos * _Farplane * 0.6, 1.0);
	vWorld = aPos;
	*/
}
