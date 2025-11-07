<template>
    <svg
        :width="props.size"
        :height="props.size"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Close"
    >
        <title>Close</title>
        <g stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <path d="M2 2 L10 10" />
            <path d="M10 2 L2 10" />
        </g>
    </svg>
</template>

<script setup>
const props = defineProps({
    size: {
        type: Number,
        default: 12,
    },
});
</script>
