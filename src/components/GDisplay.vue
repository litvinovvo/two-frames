<template>
  <div ref="display" class="flex flex-col gap-[2px] bg-display-200 rounded-sm p-[5px] touch-none">
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
import { PropType, ref, onMounted, onBeforeUnmount } from 'vue'
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
const display = ref<null | HTMLElement>(null)

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
  console.log('pointer down', e)
  e.preventDefault()
  if (e.target) {
    console.log('release from', e.target)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }
  isMouseDown.value = true
}
function onPointerUp(e: PointerEvent) {
  console.log('mouseup', e)
  isMouseDown.value = false
}

isMouseDown.value = false
onMounted(() => {
  display.value?.addEventListener('pointerdown', onPointerDown)
  display.value?.addEventListener('pointerup', onPointerUp)
})

onBeforeUnmount(() => {
  display.value?.removeEventListener('pointerdown', onPointerDown)
  display.value?.removeEventListener('pointerup', onPointerUp)
})
</script>
