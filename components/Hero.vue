<template>
    <div class="hero relative pt-20 min-h-dvh hero--center">
        <div class="container z-2 h-full sticky top-20">
            <div class="grid md:grid-cols-12 translate-y-12">
                <div class="md:col-span-8 md:col-start-3">
                    <div class="animate-slide-up flex flex-col justify-center items-center gap-12 text-center">
                        <h1 class="h1">{{ title }}</h1>
                        <p class="text-[22px]">{{ description }}</p>
                        <div class="flex gap-4">
                            <NuxtLink
                                v-for="(link, index) in links"
                                :key="link.id"
                                :to="link.url"
                                class="btn"
                                :class="{ 'btn--outline': index > 0 }"
                                >{{ link.title }}</NuxtLink
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img class="animate-slide-up delay-200!" src="/images/hero-bg-placeholder-1.5.png" alt="" />
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    links: {
        type: Array,
        required: true,
    },
});
</script>

<style scoped></style>
