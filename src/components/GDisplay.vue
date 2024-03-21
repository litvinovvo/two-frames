<template>
  <div class="px-10 pt-5 rounded-xl bg-fuchsia-800 shadow-lg shadow-stone-600 max-w-[500px] w-full relative">
    <Popper hover content="Full reset" class="text-sm">
      <button class="w-2 h-2 bg-fuchsia-950 rounded-full" @click="reset" />
    </Popper>
    <div
      class="text-center py-3 text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-fuchsia-950"
      style="text-shadow: 0px 1px 4px rgb(141 61 154 / 70%)"
    >
      GOTCHI
    </div>

    <div class="shadow-inner p-3 shadow-fuchsia-500 rounded-md">
      <div class="flex flex-col gap-[2px] bg-display-200 rounded-sm p-[5px]">
        <template v-for="(row, y) in frames[activeFrameIdx]" :key="y">
          <div class="flex flex-1 gap-[2px] w-full">
            <template v-for="(pixel, x) in row" :key="x">
              <Pixel
                :value="pixel"
                :shadow-value="timer ? 0 : frames[shadowFrameIdx][y][x]"
                @toggle="togglePixel(activeFrameIdx, y, x)"
              />
            </template>
          </div>
        </template>
      </div>
    </div>
    <div class="flex gap-6 justify-center p-10">
      <!-- <button @click="toggleFrame" 
          class="p-3 px-5 text-center py-3 rounded-full bg-fuchsia-700 shadow-md"
          style="text-shadow: 0px 1px 4px rgb(141 61 154 / 70%);"
          >
          <div
          class="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-fuchsia-600"
          style="text-shadow: 0px 1px 4px rgb(141 61 154 / 70%);">
            FRAME
          </div>
        </button> -->
      <Button text="FRAME" @click="toggleFrame" />
      <Button v-if="!timer" text="PLAY" @click="play" />
      <Button v-else text="STOP" @click="stop" />
      <Button text="SHARE" @click="share" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, computed, onMounted } from 'vue'
import Pixel from './GPixel.vue'
import Button from './GButton.vue'
import { flatToNested } from '../tools'
import { useToast } from 'vue-toast-notification'
import lzstring from 'lz-string'
import Popper from 'vue3-popper'
import 'vue-toast-notification/dist/theme-sugar.css'

const size = 20
function generateMatrix(size: number) {
  const matrix: Array<number[]> = []

  for (let i = 0; i < size; i++) {
    matrix.push(new Array(size).fill(0))
  }

  return [...matrix]
}

const shadowFrameIdx = computed(() => (activeFrameIdx.value ? 0 : 1))

function toggleFrame() {
  activeFrameIdx.value = activeFrameIdx.value ? 0 : 1
}

const timer = ref<number | number>()
function play() {
  timer.value = setInterval(() => toggleFrame(), 1000) as unknown as number
}

function stop() {
  clearInterval(timer.value)
  timer.value = undefined
}

function reset() {
  console.log('reset')
  stop()
  frames.value = [generateMatrix(size), generateMatrix(size)]
  activeFrameIdx.value = 0
  window.history.pushState(null, '', window.location.pathname)
}

function share() {
  let url = new URL(window.location.href.split('?')[0])

  frames.value.forEach((frame, frameIdx) => {
    url.searchParams.set(`f${frameIdx}`, lzstring.compressToEncodedURIComponent(frame.flat(1).join('')))
  })

  console.log('share url', url.href)
  navigator.clipboard.writeText(url.href)
  const $toast = useToast()
  $toast.success('Link copied to clipboard!')
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)

  console.log('mounted', urlParams)
  let loadedFrames = 0

  new Array(2).fill(1).forEach((_v, frameIdx) => {
    const param = urlParams.get(`f${frameIdx}`)

    console.log('param', param)

    if (param) {
      console.log('restore frame', frameIdx)
      flatToNested(lzstring.decompressFromEncodedURIComponent(param).split('').map(Number), size).forEach(
        (row, rowIdx) => {
          frames.value[frameIdx][rowIdx] = [...row]
        },
      )
      loadedFrames++
    }
  })

  if (loadedFrames > 1) {
    play()
  }
})

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
