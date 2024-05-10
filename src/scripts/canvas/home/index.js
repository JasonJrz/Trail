
import * as THREE from 'three'

import { listen } from '../../utils/listener'
import { win } from '../../utils/win'

import vertex from '../../shaders/vertex-pg.glsl'
import fragment from '../../shaders/fragment-pg.glsl'

export default class Home {
  constructor({ scene, sizes, camera }) {
    this.scene = scene
    this.sizes = sizes
    this.camera = camera

    this.group = new THREE.Group()
    this.scene.add(this.group)
    
    this.create2DCanvas()

    this.createTexture()
    this.createGeometry()
    this.createProgram()
    this.createMesh()

    listen(window, 'add', 'mousemove', this.onMM.bind(this))
  }
  
  create2DCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.height = innerHeight * 0.5
    this.canvas.width = innerWidth * 0.5
    this.canvas.style.position = 'fixed'
    this.canvas.style.height = `${innerHeight * 0.2}px`
    this.canvas.style.width = `${innerWidth * 0.2}px`
    this.canvas.style.top = 0
    this.canvas.style.left = 0
    this.canvas.style.zIndex = 10

    document.body.append(this.canvas)
    this.context = this.canvas.getContext('2d')

    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.glowImage = new Image()
    this.glowImage.src = './images/glow.png'

    //Interactive PLane
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ color: 'red' })
    )

    this.plane.visible = false

    this.scene.add(this.plane)

    this.mouse = new THREE.Vector2(9999, 9999)
    this.mousePrev = new THREE.Vector2(9999, 9999)

    this.dispTexture = new THREE.CanvasTexture(this.canvas)
  }

  createTexture() {
    const loader = new THREE.TextureLoader()
    this.texture = loader.load('./images/glow.png')
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 86, 86)
  }
  
  createProgram() {
    this.program = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uResolution: { value: [0, 0]},
        uTexture: new THREE.Uniform(this.texture),
        uColor: { value: new THREE.Color('#FF142D') },
        uDisp: { value: this.dispTexture }
      },

      // wireframe: true,
      // side: THREE.DoubleSide,
    })
  }

  createMesh() {
    this.mesh = new THREE.Points(this.geometry, this.program)
    this.scene.add(this.mesh)
  }

  onMM(event) {
    const x = (event.clientX / win.w) * 2 - 1
    const y = -(event.clientY / win.h) * 2 + 1

    const cx = (x + 1) / 2 * this.canvas.width
    const cy = (1 - y) / 2 * this.canvas.height

    this.mouse.set(cx, cy)
  }

  onResize(sizes) {
    this.sizes = sizes

    this.canvas.style.height = `${innerHeight * 0.2}px`
    this.canvas.style.width = `${innerWidth * 0.2}px`

    this.mesh.scale.set(this.sizes.width, this.sizes.height)
    this.plane.scale.set(this.sizes.width, this.sizes.height)

    this.program.uniforms.uResolution.value = [this.sizes.width, this.sizes.height]
  }

  update() {
    this.context.globalCompositeOperation = 'source-over'
    this.context.globalAlpha = 0.02
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    //Mouse Speed
    const mouseDistance = this.mousePrev.distanceTo(this.mouse)
    this.mousePrev.copy(this.mouse)
    const alpha = Math.min(mouseDistance * 0.1, 1)

    //Draw Glow
    const glowSize = this.canvas.width * 0.07

    this.context.globalCompositeOperation = 'lighten'
    this.context.globalAlpha = alpha

    this.context.drawImage(
      this.glowImage, 
      this.mouse.x - glowSize * 0.5,
      this.mouse.y - glowSize * 0.5,
      glowSize,
      glowSize
    )

    //Texture
    this.dispTexture.needsUpdate = true
  }
}