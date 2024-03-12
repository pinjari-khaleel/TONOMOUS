// https://github.com/spite/looper/tree/master/shaders

uniform float _ChromaticAbberationMaxDistort;
#define CHROMATIC_ABBERATION_ITER 12

vec2 ca_barrelDistortion(vec2 coord, float amt) {
  vec2 cc = coord - 0.5;
  float dist = dot(cc, cc);
  return coord + cc * dist * amt;
}

float ca_sat( float t ) {
  return clamp( t, 0.0, 1.0 );
}

float ca_linterp( float t ) {
  return ca_sat( 1.0 - abs( 2.0*t - 1.0 ) );
}

float ca_remap( float t, float a, float b ) {
  return ca_sat( (t - a) / (b - a) );
}

vec3 ca_spectrum_offset( float t ) {
  vec3 ret;
  float lo = step(t,0.5);
  float hi = 1.0-lo;
  float w = ca_linterp( ca_remap( t, 1.0/6.0, 5.0/6.0 ) );
  ret = vec3(lo,1.0,hi) * vec3(1.0-w, w, 1.0-w);
  return pow( ret, vec3(1.0/2.2) );
}

vec3 chromaticaberration(vec2 uv, vec3 color) {
  const float reci_num_iter_f = 1.0 / float(CHROMATIC_ABBERATION_ITER);
  vec3 sumcol = vec3(0.0);
  vec3 sumw = vec3(0.0);
  for ( int i=0; i<CHROMATIC_ABBERATION_ITER;++i ) {
    float t = float(i) * reci_num_iter_f;
    vec3 w = ca_spectrum_offset( t );
    sumw += w;
    sumcol += w * texture2D( uTexture, ca_barrelDistortion(uv, _ChromaticAbberationMaxDistort*t ) ).rgb;
  }
  return sumcol / sumw;
}