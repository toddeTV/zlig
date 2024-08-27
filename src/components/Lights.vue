<script setup lang="ts">
</script>

<template>
  <TresDirectionalLight
    cast-shadow
    :intensity="1.2"
    :position="[0, 2, 4]"
  />
  <TresAmbientLight
    :intensity="0.3"
  />
</template>

<style scoped>
</style>
