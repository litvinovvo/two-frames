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
        <GDisplay
          :frame="frames[activeFrameIdx]"
          :shadow-frame="isInPlay ? undefined : frames[shadowFrameIdx]"
          :decay="isInPlay ? 100 : 0"
          :allow-drawing="!isInPlay"
          @click="togglePixel"
        >
          <template #top>
            <div class="text-display-500 flex text-xs w-full justify-center items-center">
              <div class="min-w-[2ch] box-content">
                {{ activeFrameIdx < 9 ? '0' + (activeFrameIdx + 1) : activeFrameIdx + 1 }}
              </div>
              /
              <div class="min-w-[2ch] box-content">
                {{ framesCount < 9 ? '0' + framesCount : framesCount }}
              </div>
              <button class="px-1 text-lg text-display-400" @click="addFrame">+</button>
              <button class="px-1 text-lg text-display-400" @click="removeFrame">-</button>
              <div class="min-w-[2ch] box-content ml-auto">{{ fps < 9 ? '0' + fps : fps }} fps</div>
              <button class="px-1 text-lg text-display-400" @click="increaseFps">+</button>
              <button class="px-1 text-lg text-display-400" @click="decreaseFps">-</button>
            </div>
          </template>
        </GDisplay>
      </div>
    </div>
    <div class="flex flex-col gap-6 justify-center p-8">
      <div class="flex flex-1 w-full gap-3">
        <GButton text="PREV" class="w-full" @click="prevFrame" />
        <GButton text="NEXT" class="w-full" @click="nextFrame" />
      </div>
      <GButton v-if="!isInPlay" text="PLAY" @click="play" />
      <GButton v-else text="STOP" @click="stop" />
      <GButton text="SHARE" @click="share" />
      <!-- <PushableButton @click="share"> SHARE </PushableButton> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, computed, onMounted } from 'vue'
import GButton from './GButton.vue'
import GDisplay from './GDisplay.vue'
// import PushableButton from './GPushable.vue'
import { flatToNested } from '../tools'
import { useToast } from 'vue-toast-notification'
import lzstring from 'lz-string'
import Popper from 'vue3-popper'
import 'vue-toast-notification/dist/theme-sugar.css'

const framesCount = ref(2)
const fps = ref(1)

const size = 20
function generateMatrix(size: number) {
  const matrix: Array<number[]> = []

  for (let i = 0; i < size; i++) {
    matrix.push(new Array(size).fill(0))
  }

  return [...matrix]
}

const shadowFrameIdx = computed(() => {
  if (activeFrameIdx.value === 0) {
    return framesCount.value - 1
  }
  return activeFrameIdx.value - 1
})

function increaseFps() {
  fps.value = fps.value + 1
}

function decreaseFps() {
  if (fps.value === 1) {
    return
  }
  fps.value = fps.value - 1
}

function addFrame() {
  framesCount.value++
  frames.value.push(generateMatrix(size))
}

function removeFrame() {
  if (framesCount.value > 2 && activeFrameIdx.value !== framesCount.value - 1) {
    framesCount.value--
    frames.value.pop()
  }
}
function nextFrame() {
  activeFrameIdx.value = activeFrameIdx.value === framesCount.value - 1 ? 0 : activeFrameIdx.value + 1
}

function prevFrame() {
  activeFrameIdx.value = activeFrameIdx.value === 0 ? framesCount.value - 1 : activeFrameIdx.value - 1
}

const isInPlay = ref(false)
const frameId = ref<number | null>(null)
const lastFrameTimestamp = ref<number>(0)
const fpsInterval = computed(() => Math.floor(1000 / fps.value))

function update(timestamp: number) {
  const elapsed = timestamp - lastFrameTimestamp.value

  if (elapsed >= fpsInterval.value) {
    nextFrame()
    lastFrameTimestamp.value = timestamp
  }

  frameId.value = window.requestAnimationFrame(update)
}

function play() {
  isInPlay.value = true
  frameId.value = window.requestAnimationFrame(update)
}

function stop() {
  isInPlay.value = false
  frameId.value && cancelAnimationFrame(frameId.value)
  frameId.value = null
}

function reset() {
  console.log('reset')
  stop()
  frames.value = [generateMatrix(size), generateMatrix(size)]
  framesCount.value = 2
  fps.value = 1
  activeFrameIdx.value = 0
  window.history.pushState(null, '', window.location.pathname)
}

function share() {
  let url = new URL(window.location.href.split('?')[0])

  frames.value.forEach((frame, frameIdx) => {
    url.searchParams.set(`f${frameIdx}`, lzstring.compressToEncodedURIComponent(frame.flat(1).join('')))
  })

  url.searchParams.set('fps', String(fps.value))

  console.log('share url', url.href)
  navigator.clipboard.writeText(url.href)
  const $toast = useToast()
  $toast.success('Link copied to clipboard!')
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  console.log('mounted', urlParams)

  const fpsParam = urlParams.get('fps')

  if (fpsParam && !Number.isNaN(Number(fpsParam))) {
    fps.value = Number(fpsParam)
  }

  let loadedFrames = 0
  let frameIdx = 0
  while (urlParams.get(`f${frameIdx}`)) {
    console.log('restore frame', frameIdx)
    const param = urlParams.get(`f${frameIdx}`)

    if (!param) {
      break
    }
    flatToNested(lzstring.decompressFromEncodedURIComponent(param).split('').map(Number), size).forEach(
      (row, rowIdx) => {
        if (!frames.value[frameIdx]) {
          addFrame()
        }
        frames.value[frameIdx][rowIdx] = [...row]
      },
    )
    loadedFrames++
    frameIdx++
  }

  if (loadedFrames > 1) {
    play()
  }
})

onUnmounted(() => {
  stop()
})

const frames = ref([generateMatrix(size), generateMatrix(size)])
const activeFrameIdx = ref(0)

function togglePixel(y: number, x: number, frame = activeFrameIdx.value) {
  console.log('toggle', y, x)
  frames.value[frame][y][x] = frames.value[frame][y][x] ? 0 : 1
}
</script>
