<template>
  <div class="p-10 rounded-xl bg-fuchsia-800 w-min shadow-lg shadow-stone-600">
    <div class="shadow-inner  p-3  shadow-fuchsia-500 rounded-md ">
      <div class="w-min flex flex-col gap-[2px] bg-display-200 rounded-sm p-[5px]">
        <template v-for="(row, y) in frames[activeFrameIdx]" :key="y">
          <div class="flex gap-[2px]">
            <template v-for="(pixel, x) in row" :key="x">
              <Pixel :value="pixel" :shadow-value="timer ? 0 : frames[shadowFrameIdx][y][x]" @toggle="togglePixel(activeFrameIdx, y, x)"/>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div class="mt-5 flex gap-3">
    <button @click="toggleFrame" class="p-3 bg-fuchsia-700 text-white">toggle frame</button>
    <button v-if="!timer" @click="play" class="p-3 bg-fuchsia-700 text-white">play</button>
    <button v-else @click="stop" class="p-3 bg-fuchsia-700 text-white">stop</button>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, computed } from 'vue'
import Pixel from './Pixel.vue'

const size = 20
function generateMatrix(size: number) {

  const matrix: Array<number[]> = []

  for (let i = 0; i < size; i++) {
    matrix.push(new Array(size).fill(0))
  }

  return [...matrix]
}

const shadowFrameIdx = computed(() => activeFrameIdx.value ? 0 : 1)

function toggleFrame() {
  activeFrameIdx.value = activeFrameIdx.value ? 0 : 1
}

const timer = ref<undefined | number>()
function play() {
  timer.value = setInterval(() => toggleFrame(), 800)
}

function stop() {
  clearInterval(timer.value)
  timer.value = undefined
}

onUnmounted(() => {
  clearInterval(timer.value)
})

const frames = ref([generateMatrix(size), generateMatrix(size)])
const activeFrameIdx = ref(0)

function togglePixel(frame: number, y: number, x: number) {
  console.log('toggle', y, x)
  frames.value[frame][y][x] = frames.value[frame][y][x] ? 0 : 1
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
