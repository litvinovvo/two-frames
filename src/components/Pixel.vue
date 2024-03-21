<template>
    <div class="aspect-square rounded-[2px] w-full"  
    :class="[
        value ? 'bg-display-800 ' : shadowValue ? 'bg-display-500' : 'bg-display-300',
        shadowValue !== value && 'transition-all duration-300 ease-in-out',
    ]"
    :style="value ? 'box-shadow: rgba(0, 0, 0, 0.95) 0px 0px 1px;' : ''"
    @click="$emit('toggle')">
    </div>
</template>

<script setup lang="ts">
defineProps({
    value: {
        type: Number,
        required: true
    },
    shadowValue: {
        type: Number,
        default: false
    }
})

defineEmits(['toggle'])
</script>