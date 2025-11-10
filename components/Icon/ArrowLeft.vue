<template>
    <svg :width="18 * scale" :height="14 * scale" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17 7H1m0 0 6-6M1 7l6 6"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
</template>

<script setup>
const props = defineProps({
    scale: {
        type: Number,
        default: 1,
    },
});
</script>
