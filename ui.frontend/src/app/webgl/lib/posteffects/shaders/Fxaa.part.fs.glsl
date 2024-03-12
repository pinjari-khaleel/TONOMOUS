uniform float _FxaaStrength;

float fxaagetlumi(vec3 col){
    return dot(col,vec3(0.299, 0.587, 0.114));
}
vec3 fxaasample(sampler2D _Tex,vec2 uv){
    vec3 e = vec3(1./uResolution.xy,0.);

    float reducemul = 0.125;// 1. / 8.;
    float reducemin = 0.0078125;// 1. / 128.;

    vec3 Or = texture2D(_Tex,uv).rgb;
    vec3 LD = texture2D(_Tex,uv - e.xy).rgb;
    vec3 RD = texture2D(_Tex,uv + vec2( e.x,-e.y)).rgb;
    vec3 LT = texture2D(_Tex,uv + vec2(-e.x, e.y)).rgb;
    vec3 RT = texture2D(_Tex,uv + e.xy).rgb;

    float Or_Lum = fxaagetlumi(Or.rgb);
    float LD_Lum = fxaagetlumi(LD.rgb);
    float RD_Lum = fxaagetlumi(RD.rgb);
    float LT_Lum = fxaagetlumi(LT.rgb);
    float RT_Lum = fxaagetlumi(RT.rgb);

    float min_Lum = min(Or_Lum,min(min(LD_Lum,RD_Lum),min(LT_Lum,RT_Lum)));
    float max_Lum = max(Or_Lum,max(max(LD_Lum,RD_Lum),max(LT_Lum,RT_Lum)));

    //x direction,-y direction
    vec2 dir = vec2((LT_Lum+RT_Lum)-(LD_Lum+RD_Lum),(LD_Lum+LT_Lum)-(RD_Lum+RT_Lum));
    float dir_reduce = max((LD_Lum+RD_Lum+LT_Lum+RT_Lum)*reducemul*0.25,reducemin);
    float dir_min = 1./(min(abs(dir.x),abs(dir.y))+dir_reduce);
    dir = min(vec2(_FxaaStrength),max(-vec2(_FxaaStrength),dir*dir_min)) * e.xy;

    //------
    vec3 resultA = 0.5*(texture2D(_Tex,uv-0.166667*dir).rgb+texture2D(_Tex,uv+0.166667*dir).rgb);
    vec3 resultB = resultA*0.5+0.25*(texture2D(_Tex,uv-0.5*dir).rgb+texture2D(_Tex,uv+0.5*dir).rgb);
    float B_Lum = fxaagetlumi(resultB.rgb);

    //return resultA;
    if(B_Lum < min_Lum || B_Lum > max_Lum) {
        return resultA;
    } else {
        return resultB;
    }
}


vec3 fxaa(vec2 uv, vec3 color) {
	return fxaasample( uTexture, uv );
}