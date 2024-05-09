
precision highp float;

uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vColor;

void main() {
   vec2 uv = gl_PointCoord;
    float distCenter = length(uv - vec2(0.5));

    if(distCenter > 0.5) discard;

    float alpha = clamp(vColor.z, 0.0, 1.0);

    gl_FragColor = vec4(vec3(uColor), normalize(vColor.z));
}