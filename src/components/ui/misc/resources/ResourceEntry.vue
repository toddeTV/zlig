<script setup lang="ts">
import type Big from 'big.js'

const props = defineProps<{
  resource: Big
  available?: Big
}>()
</script>

<template>
  <b
    :class="{
      'text-red-500': props.available?.lt(props.resource),
      'text-green-700': props.available?.gte(props.resource),
    }"
  >{{ props.resource.toNumber().toLocaleString() }}</b>
</template>
