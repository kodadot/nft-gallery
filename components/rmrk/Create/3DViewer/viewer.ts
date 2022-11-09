import {
  AmbientLight,
  Box3,
  Cache,
  DirectionalLight,
  LinearToneMapping,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

Cache.enabled = true

export class Viewer {
  el: HTMLElement
  lights
  content
  camera
  lightSettings = {
    punctualLights: true,
    exposure: 0.0,
    toneMapping: LinearToneMapping,
    ambientIntensity: 0.3,
    ambientColor: 0xffffff,
    directIntensity: 0.8 * Math.PI, // TODO(#116)
    directColor: 0xffffff,
  }
  scene
  renderer
  controls

  constructor(el: HTMLElement) {
    this.el = el
    this.lights = []
    this.scene = new Scene()
    const fov = (1 * 180) / Math.PI

    this.camera = new PerspectiveCamera(
      fov,
      el.clientWidth / el.clientHeight,
      0.01,
      1000
    )
    this.scene.add(this.camera)

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(el.clientWidth, el.clientHeight)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = -10
    this.controls.screenSpacePanning = true
    this.controls.enabled = true

    this.el.appendChild(this.renderer.domElement)

    this.animate = this.animate.bind(this)
    requestAnimationFrame(this.animate)
    window.addEventListener('resize', this.resize.bind(this), false)
  }

  animate() {
    requestAnimationFrame(this.animate)
    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  resize() {
    const { clientHeight, clientWidth } = this.el as HTMLElement

    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(clientWidth, clientHeight)
  }

  load(url) {
    const loader = new GLTFLoader().setCrossOrigin('anonymous')

    loader.load(url, (gltf) => {
      const scene = gltf.scene || gltf.scenes[0]

      if (!scene) {
        // Valid, but not supported by this viewer.
        throw new Error(
          'This model contains no scene, and cannot be viewed here. However,' +
            ' it may contain individual 3D resources.'
        )
      }

      this.setContent(scene)
    })
  }

  /**
   * @param {THREE.Object3D} object
   * @param {Array<THREE.AnimationClip} clips
   */
  setContent(object) {
    this.clear()

    const box = new Box3().setFromObject(object)
    const size = box.getSize(new Vector3()).length()
    const center = box.getCenter(new Vector3())

    this.controls.reset()

    object.position.x += object.position.x - center.x
    object.position.y += object.position.y - center.y
    object.position.z += object.position.z - center.z
    this.controls.maxDistance = size * 10
    this.camera.near = size / 100
    this.camera.far = size * 100
    this.camera.updateProjectionMatrix()

    this.camera.position.copy(center)
    this.camera.position.x += size / 2.0
    this.camera.position.y += size / 2.0
    this.camera.position.z += size / 2.0
    this.camera.lookAt(center)

    this.controls.saveState()

    this.scene.add(object)
    this.content = object

    this.content.traverse((node) => {
      if (node.isMesh) {
        // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
        node.material.depthWrite = !node.material.transparent
      }
    })

    this.updateLights()
  }

  updateLights() {
    const lightSettings = this.lightSettings
    const lights = this.lights
    this.addLights()

    this.renderer.toneMapping = Number(lightSettings.toneMapping)
    this.renderer.toneMappingExposure = Math.pow(2, lightSettings.exposure)

    if (lights.length === 2) {
      lights[0].intensity = lightSettings.ambientIntensity
      lights[0].color.setHex(lightSettings.ambientColor)
      lights[1].intensity = lightSettings.directIntensity
      lights[1].color.setHex(lightSettings.directColor)
    }
  }

  addLights() {
    const lightSettings = this.lightSettings

    const light1 = new AmbientLight(
      lightSettings.ambientColor,
      lightSettings.ambientIntensity
    )
    light1.name = 'ambient_light'
    this.camera.add(light1)

    const light2 = new DirectionalLight(
      lightSettings.directColor,
      lightSettings.directIntensity
    )
    light2.position.set(0.5, 0, 0.866) // ~60º
    light2.name = 'main_light'
    this.camera.add(light2)

    this.lights.push(light1, light2)
  }

  clear() {
    if (!this.content) {
      return
    }
    this.scene.remove(this.content)

    // dispose geometry
    this.content.traverse((node) => {
      if (!node.isMesh) {
        return
      }

      node.geometry.dispose()
    })

    // dispose textures
    traverseMaterials(this.content, (material) => {
      for (const key in material) {
        if (key !== 'envMap' && material[key] && material[key].isTexture) {
          material[key].dispose()
        }
      }
    })
  }
}

function traverseMaterials(object, callback) {
  object.traverse((node) => {
    if (!node.isMesh) {
      return
    }
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material]
    materials.forEach(callback)
  })
}
