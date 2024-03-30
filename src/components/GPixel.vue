<template>
  <div
    class="aspect-square rounded-[2px] w-full"
    :class="[
      value ? 'bg-display-800 ' : shadowValue ? 'bg-display-500' : 'bg-display-300',
      shadowValue !== value && 'transition-all ease-in-out',
    ]"
    :style="{
      'box-shadow': value ? 'rgba(0, 0, 0, 0.95) 0px 0px 1px' : '',
      'transition-duration': `${decay}ms`,
    }"
  ></div>
</template>

<script setup lang="ts">
defineProps({
  value: {
    type: Number,
    required: true,
  },
  shadowValue: {
    type: Number,
    default: 0,
  },
  decay: {
    type: Number,
    default: 0,
  },
})
</script>
