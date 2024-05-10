
// import { Renderer, Camera, Transform } from 'ogl'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { listen } from '../utils/listener'
import { win } from '../utils/win'

import Home from './home'

export default class Gl {
  constructor({ engine, scroll, template }) {
    this.engine = engine
    this.scroll = scroll
    this.template = template

    this.createRen()
    this.createCam()
    this.createScene()

    this.createHome()
    
    this.onResize()
    
    listen(window, 'add', 'resize', this.onResize.bind(this))
  }

  /**
   * Init Webgl
   */
  createRen() {
    const dpr = Math.min(devicePixelRatio, 2)
    const canvas = document.querySelector('#gl')

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })

    this.renderer.setPixelRatio(dpr)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  createCam() {
    this.cam = new THREE.PerspectiveCamera(35, win.w / win.h, 0.1, 100)
    this.cam.position.z = 5

    this.controls = new OrbitControls(this.cam, this.renderer.domElement)
  }
  
  createScene() {
    this.scene = new THREE.Scene()
  }

  /**
   * Pages
   */
  createHome() {
    this.home = new Home({
      scene: this.scene,
      sizes: this.sizes,
      camera: this.cam
    })
  }

  /**
   * Events.
   */
  onResize() {
    this.renderer.setSize(win.w, win.h)

    this.cam.aspect = win.w / win.h
    this.cam.updateProjectionMatrix()

    const fov = this.cam.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.cam.position.z
    const width = height * this.cam.aspect

    this.sizes = {
      height,
      width
    }

    if(this.home) this.home.onResize(this.sizes)
  }

  update(scroll) {
    if(this.home) this.home.update(scroll)

    this.controls.update()
    this.renderer.render(this.scene, this.cam)
  }
}