<template>
  <div class="px-10 pt-5 rounded-xl bg-fuchsia-800 shadow-lg shadow-stone-600 max-w-[500px] w-full">
    <div 
      class="text-center py-3 text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-fuchsia-950"
      style="text-shadow: 0px 1px 4px rgb(141 61 154 / 70%);"
      >
      GOTCHI
    </div>
    <div class="shadow-inner p-3  shadow-fuchsia-500 rounded-md ">
      <div class="flex flex-col gap-[2px] bg-display-200 rounded-sm p-[5px]">
        <template v-for="(row, y) in frames[activeFrameIdx]" :key="y">
          <div class="flex flex-1 gap-[2px] w-full">
            <template v-for="(pixel, x) in row" :key="x">
              <Pixel :value="pixel" :shadow-value="timer ? 0 : frames[shadowFrameIdx][y][x]" @toggle="togglePixel(activeFrameIdx, y, x)"/>
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
        <Button @click="toggleFrame" text="FRAME"></Button>
        <Button  v-if="!timer" @click="play" text="PLAY"></Button>
        <Button v-else @click="stop" text="STOP"></Button>
        <Button @click="share" text="SHARE"></Button>
      <!-- <button v-if="!timer" @click="play" class="p-3 px-5 bg-fuchsia-700 text-white rounded-full">PLAY</button> -->
      <!-- <button v-else @click="stop" class="p-3 px-5 bg-fuchsia-700 text-white rounded-full">STOP</button> -->
    </div>
  </div>
</template>

<!-- background-color: #470555;
color: transparent;
text-shadow: 0px 1px 5px rgb(141 61 154 / 80%);
background-clip: text;
font-size: 47px; -->

<script setup lang="ts">
import { onUnmounted, ref, computed, onMounted } from 'vue'
import Pixel from './Pixel.vue'
import Button from './Button.vue'
import { hexToArray, arrayToHex } from '../tools'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

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
  timer.value = setInterval(() => toggleFrame(), 1000)
}

function stop() {
  clearInterval(timer.value)
  timer.value = undefined
}

function share() {
  let url = new URL(window.location.href.split('?')[0]);

  url.searchParams.set('f0', arrayToHex(frames.value[0].flat(1)));
  url.searchParams.set('f1', arrayToHex(frames.value[1].flat(1)));

  console.log('share url', url.href)
  navigator.clipboard.writeText(url.href);
  const $toast = useToast();
  $toast.success('Link copied to clipboard!');
}

function hexToNested(hex: string, size: number) {
  return hexToArray(hex).reduce((acc, _current, index, array) => {
      if (index % size === 0) { // Для каждого элемента с четным индексом (нумерация с 0)
        acc.push(array.slice(index, index + size)); // Добавляем пару в аккумулятор
      }
    return acc;
    }, [] as Array<number[]>)
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)

  console.log('mounted', urlParams)

  new Array(2).fill(1).forEach((_v, frameIdx) => {
    const param = urlParams.get(`f${frameIdx}`)

    console.log('param', param)

    if (param) {
      console.log('restore frame', frameIdx, hexToNested(param, size))
      hexToNested(param, size).forEach((row, rowIdx) => {
        frames.value[frameIdx][rowIdx] = [...row]
    })
    }
  })
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
