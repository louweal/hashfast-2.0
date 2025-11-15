<template>
    <div class="bg-background border border-border rounded-xl p-8 flex flex-col gap-8 animate-slide-up">
        <div class="flex gap-4 items-center">
            <div class="rounded-full bg-dark w-12 h-12 overflow-hidden">
                <img v-if="image" :src="image ?? image" class="w-full h-full object-cover" />
            </div>
            <div>
                <h3 class="font-medium text-base">{{ name }}</h3>
                <p class="text-sm text-secondary opacity-50">{{ role }}</p>
            </div>
        </div>
        <p>{{ text }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: false,
        default: 'Hbarbarian',
    },
    image: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: true,
    },
});
</script>
