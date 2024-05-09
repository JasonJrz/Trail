
attribute vec3 normal;
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D uDisp;

uniform vec2 uResolution;

varying vec3 vColor;

void main() {
  float tIntensity = texture2D(uDisp, uv).r;
  tIntensity = smoothstep(0.1, 0.4, tIntensity);

  // Final position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  gl_PointSize = 20.0 * tIntensity * uResolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vColor = vec3(pow(tIntensity, 2.0));
}