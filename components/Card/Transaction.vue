<template>
    <a
        :href="`https://hashscan.io/${network}/transaction/${transactionId}`"
        target="_blank"
        class="flex flex-col gap-2 justify-center items-center w-full"
    >
        <span class="lg:hidden">
            <client-only>
                {{ new Date(timestamp).toLocaleString() }}
            </client-only>
        </span>
        <div class="bg-background hover:bg-background/50 border border-border rounded-sm px-5 py-4 w-full relative">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center lg:w-9/10 xl:w-full">
                <div
                    class="col-span-2 lg:col-span-1 text-center lg:text-left lg:order-3 text-wide text-base font-medium"
                >
                    <span class="lg:hidden">+</span>{{ amount }}
                    {{ currency.toUpperCase() }}
                </div>
                <div class="text-base lg:order-1">{{ name }}</div>
                <div class="lg:order-2 flex justify-end lg:justify-start">
                    <!-- <client-only> -->
                    <div
                        class="text-heading rounded-sm px-2 py-1 border border-border text-wide font-medium"
                        :style="`background-color: hsl(${hue(accountId)}, 60%, 40%)`"
                    >
                        {{ accountId }}
                    </div>
                    <!-- </client-only> -->
                </div>
                <div class="lg:order-4 hidden lg:block opacity-75">
                    <client-only>
                        {{ new Date(timestamp).toLocaleString() }}
                    </client-only>
                </div>
            </div>
            <IconHashscan
                class="absolute top-4 right-5 opacity-20 transition-opacity duration-300 hover:opacity-50 hidden 2xl:block"
            />
        </div>
    </a>
</template>

<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();
const network = ref(config.public.hederaNetwork || "testnet");

const props = defineProps({
    transactionId: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    name: {
        type: [String, null],
        required: false,
    },
});

const accountId = ref(props.transactionId.split("@")[0]);
const timestamp = ref(props.transactionId.split("@")[1] * 1000);

const hue = (s) => {
    if (!s) {
        s = `0.0.${Math.floor(Math.random() * 1_000_000)}`;
    }
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash * 31 + s.charCodeAt(i)) | 0; // 31 = prime multiplier
    }
    return 240 + (Math.abs(hash) % 60); // hue between 0–359
};
</script>
