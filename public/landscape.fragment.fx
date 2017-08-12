precision highp float;

varying vec2 vUV;
varying vec3 vPos;
uniform sampler2D textureSampler;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
    vec4 col = texture(textureSampler, vec2(vPos.z/8.0+0.5, vPos.y/4.0+0.5+rand(vPos.xy)/5.0));
    gl_FragColor = vec4(col);
}