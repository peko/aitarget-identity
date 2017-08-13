precision highp float;

varying vec2 vUV;
varying vec3 vPos;
uniform sampler2D textureSampler;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
    vec2 c = vec2(
        vPos.z/8.0+0.5      +vPos.y/8.0,
        vPos.x/8.0+0.5-0.001+vPos.y/4.0);
    vec4 col = texture(textureSampler, c+rand(c)/10.0);
    gl_FragColor = vec4(col);
}