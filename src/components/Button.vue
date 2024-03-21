<template>
          <button
          class="p-3 px-5 text-center py-3 rounded-full bg-fuchsia-700 shadow-md hover:shadow-sm transition-all ease-in-out "
          >
          <div
          class="text-md font-bold tracking-wider text-transparent bg-clip-text bg-fuchsia-500"
          style="text-shadow: 0px 1px 4px rgb(141 61 154 / 60%);">
            {{ text }}
          </div>
        </button>
</template>

<script setup lang="ts">

defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>