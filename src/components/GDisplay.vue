<template>
  <div class="flex flex-col gap-[2px] bg-display-200 rounded-sm p-[5px] touch-none">
    <slot name="top" />
    <template v-for="(row, y) in frame" :key="y">
      <div class="flex flex-1 gap-[2px] w-full">
        <template v-for="(pixel, x) in row" :key="x">
          <Pixel
            :value="pixel"
            :shadow-value="shadowFrame ? shadowFrame[y][x] : 0"
            @pointerdown="() => onPixelClick(y, x)"
            @pointerenter="() => onPointerEnter(y, x)"
          />
        </template>
      </div>
    </template>
    <slot name="bottom" />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, onMounted, onUnmounted } from 'vue'
import Pixel from './GPixel.vue'

const props = defineProps({
  frame: {
    type: Object as PropType<Array<number[]>>,
    required: true,
  },
  shadowFrame: {
    type: Object as PropType<Array<number[]> | undefined>,
    default: undefined,
  },
  decay: {
    type: Number,
    required: true,
  },
  allowDrawing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
const isMouseDown = ref(false)

function onPointerEnter(y: number, x: number) {
  if (props.allowDrawing && isMouseDown.value) {
    onPixelClick(y, x)
  }
}

function onPixelClick(y: number, x: number) {
  if (props.allowDrawing) {
    emit('click', y, x)
  }
}

function onPointerDown(e: PointerEvent) {
  if (e.target) {
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }
  console.log('mousedown')
  isMouseDown.value = true
}
function onPointerUp() {
  console.log('mouseup')
  isMouseDown.value = false
}

isMouseDown.value = false
onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('pointerup', onPointerUp)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('mopointerupuseup', onPointerUp)
})
</script>
