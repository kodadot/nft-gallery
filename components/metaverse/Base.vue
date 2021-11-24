<template>
  <a-scene inspector-plugin-recast>
    <a-assets id="assets">
        <a-mixin id="all-interactions" hoverable grabbable draggable
            event-set__hoveron="_event: hover-start; material.opacity: 0.7; transparent: true"
            event-set__hoveroff="_event: hover-end; material.opacity: 1; transparent: false" hands-grab
            physx-body="type: dynamic"></a-mixin>
    </a-assets>

    <!-- 3d Models -->
    <a-gltf-model :src="space" scale="1 1 1" position="15.70262 -0.9575 -2.54031"
        gltf-model="https://cdn.glitch.me/6d877418-2a34-48a1-b3eb-2cc2670deeef%2FGlb1.glb?v=1636762271679" visible=""
        rotation="0 -92.0743176775233 0">

        <a-entity arrange-nft>
        </a-entity>
    </a-gltf-model>

    <!-- Camera Rig -->
    <a-entity id="cameraRig">
        <!-- position="0 8 0" -->
        <a-entity id="head" camera wasd-controls look-controls position="-65 20 80">
        </a-entity>
        <a-entity id="ctlL"
            teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head; startEvents: teleportstart; endEvents: teleportend"
            raycaster="objects: .collidable; far:1.2; " hand-controls="hand: left" mixin="physics-hands" input-listen
            phase-shift physx-hidden-collision>
            <a-text value="Press and let go \nX: to Move" position="0 0.08 0" rotation="-90 0 0" scale="0.1 0.1 0.1"
                align="center" color="#FFFFFF"></a-text>
            <a-sphere radius="0.01" position="0 0 -1.2" color="#FFFFFF" physx-no-collision></a-sphere>
        </a-entity>
        <a-entity id="ctlR" raycaster="objects: .collidable; far:1.2; " hand-controls="hand: right"
            mixin="physics-hands" input-listen phase-shift physx-hidden-collision>
            <a-text value="Use Grip to interact" position="0 0.08 0" rotation="-90 0 0" scale="0.1 0.1 0.1"
                align="center" color="#FFFFFF"></a-text>
            <a-sphere radius="0.01" position="0 0 -1.2" color="#FFFFFF" physx-no-collision></a-sphere>
        </a-entity>
    </a-entity>
</a-scene>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Base extends Vue {
  public space = 'https://cdn.glitch.me/6d877418-2a34-48a1-b3eb-2cc2670deeef%2FGlb1.glb?v=1636762271679'
  private value2: any;
  @Prop() public value!: any;
}
</script>
