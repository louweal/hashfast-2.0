<template>
    <div class="relative inline-block group">
        <button
            class="cursor-pointer"
            onclick="this.nextElementSibling.classList.toggle('opacity-100'); this.nextElementSibling.classList.toggle('pointer-events-auto');"
        >
            <slot />
        </button>

        <div
            class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 w-max max-w-lg rounded-sm bg-dark shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-200 border border-border"
        >
            <div class="relative bg-dark w-full h-full px-2 py-0.5 rounded-sm text-sm font-normal z-10">
                {{ text }}
            </div>
            <div
                class="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-dark border border-border rotate-45"
            ></div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true,
    },
});
</script>
