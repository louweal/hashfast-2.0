<template>
    <section class="py-20">
        <div class="container">
            <div class="bg-background rounded-xl overflow-hidden flex animate-slide-up">
                <div class="grid lg:grid-cols-2 gap-12 items-center">
                    <div class="order-1 lg:order-2" v-if="image">
                        <img :src="image" alt="create link" class="bg-background w-full h-full" />
                    </div>
                    <div class="flex flex-col gap-5 items-start p-5 py-8 lg:p-16 lg:pr-0">
                        <h2 class="text-4xl font-medium">{{ title }}</h2>
                        <p class="text-lg">
                            {{ description }}
                        </p>

                        <div class="flex gap-4 order-2 lg:order-1">
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
    </section>
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
    image: {
        type: String,
        required: false,
    },
});
</script>
