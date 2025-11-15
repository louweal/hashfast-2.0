<template>
    <div class="hero relative pt-20 min-h-dvh">
        <div class="hero__inner w-full z-2 sticky top-0 pt-20">
            <div class="container">
                <div class="grid md:grid-cols-12 translate-y-12 pb-20">
                    <div class="md:col-span-6 md:col-start-4">
                        <div class="animate-slide-up flex flex-col justify-center items-center gap-12 text-center">
                            <h1 class="h1">{{ title }}</h1>
                            <p class="text-[22px]">{{ description }}</p>
                            <div class="flex gap-4">
                                <NuxtLink
                                    v-for="(link, index) in links"
                                    :key="link.id"
                                    :to="link.url"
                                    class="btn"
                                    :class="{ 'btn--transparent': index > 0 }"
                                    >{{ link.title }}</NuxtLink
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img class="animate-slide-up delay-200!" src="/images/hero-visual-1.5.png" alt="" />
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

<style scoped>
.hero {
    .hero__inner {
        background: linear-gradient(180deg, rgb(17, 24, 39) 0%, rgb(0, 0, 0, 0) 100%);
        -webkit-backdrop-filter: blur(1px);
        backdrop-filter: blur(1px);
    }
}
</style>
