<template>
    <div
        class="flex rounded-lg bg-dark border border-border size-12 items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out"
        :class="{
            'border-primary': curRating === rating,
        }"
    >
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    rating: {
        type: Number,
        required: true,
    },
    curRating: {
        type: Number,
        required: false,
    },
});
</script>
