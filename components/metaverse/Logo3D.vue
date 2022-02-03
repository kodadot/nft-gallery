<template>
  <a-entity>
    <a-box
      rotation="0 -45 0"
      scale="0.2 0.2 0.2"
      depth="0.2"
      height="0.2"
      width="0.2"
      :color="this.$brand.gray2"
      animation="property: rotation; from: 0 0 0; to: 0 360 0 ; loop: true; dur: 6000; easing:linear;"
    >
      <a-cylinder
        position="0 0.7 0"
        rotation="0 90 0"
        radius="0.06"
        height="1.5"
        :color="this.$brand.blue"
      >
        <a-cone
          position="0 0.8 0"
          :color="this.$brand.blue"
          height="0.25"
          radius-bottom="0.1"
          radius-top="0.01"
        >
        </a-cone>
      </a-cylinder>
      <a-cylinder
        position="0 0 -0.7"
        rotation="0 90 90"
        radius="0.06"
        height="1.5"
        :color="this.$brand.green"
      >
        <a-cone
          position="0 -0.8 0"
          :color="this.$brand.green"
          height="0.25"
          radius-bottom="0.01"
          radius-top="0.1"
        >
        </a-cone>
      </a-cylinder>
      <a-cylinder
        position="0.7 0 0"
        rotation="0 0 90"
        radius="0.06"
        height="1.5"
        :color="this.$brand.pink"
      >
        <a-cone
          position="0 -0.8 0"
          :color="this.$brand.pink"
          height="0.25"
          radius-bottom="0.01"
          radius-top="0.1"
        >
        </a-cone>
      </a-cylinder>
    </a-box>
    <a-troika-text
      position="1.3 .2 0"
      :color="this.$brand.dark1"
      fontSize="1"
      value="Extended Collection"
    >
    </a-troika-text>

    <a-troika-text
      position="1.3 -.1 0"
      scale="0.7 0.7 0.7"
      :color="this.$brand.dark1"
      fontSize="0.5"
      value="Curating the Immersive Web"
    >
    </a-troika-text>
  </a-entity>
</template>

<script>
export default {}
</script>

<style>
</style>