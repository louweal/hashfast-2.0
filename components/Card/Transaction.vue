<template>
    <a
        :href="`https://hashscan.io/${network}/transaction/${transactionId}`"
        target="_blank"
        class="flex flex-col gap-2 justify-center items-center animate-slide-up"
    >
        <span>
            <client-only>
                {{ new Date(timestamp).toLocaleString() }}
            </client-only>
        </span>
        <div class="bg-background border border-border rounded-sm px-5 py-4 w-full relative group">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center lg:w-9/10 xl:w-full">
                <div
                    class="col-span-2 lg:col-span-1 text-center lg:text-left lg:order-3 text-wide text-base font-medium"
                >
                    <span class="lg:hidden">+</span>{{ amount }}
                    {{ currency.toUpperCase() }}
                </div>
                <div class="text-base lg:order-1">{{ name }}</div>
                <div class="lg:order-3 flex justify-end lg:justify-start">
                    <div
                        class="relative text-heading rounded-sm px-3 py-1 pt-2 font-medium flex gap-2 items-center cursor-pointer hover:opacity-100 group/account"
                        @click.stop.prevent="handleAddContact(accountId)"
                        :style="`background-color: hsl(${hue(accountId)}, 60%, 40%)`"
                    >
                        <client-only>
                            <span class="group-hover/account:opacity-100 opacity-80" v-if="contact">{{
                                contact.name
                            }}</span>
                            <span v-else class="text-wide">{{ accountId }}</span>
                        </client-only>
                        <div
                            class="absolute -top-2 -right-2 bg-gray-200 rounded-full size-4 text-center text-black flex justify-center items-center leading-none text-base opacity-0 group-hover/account:opacity-100 duration-300 ease-in-out"
                        >
                            +
                        </div>
                    </div>
                </div>
                <div class="lg:order-4 hidden lg:block opacity-75 text-right group-hover:opacity-100 duration-300">
                    View on HashScan
                </div>
            </div>
        </div>
    </a>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();
const network = ref(config.public.hederaNetwork || 'testnet');

const props = defineProps({
    transactionId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
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
    handleAddContact: {
        type: Function,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userAccountId: {
        type: String,
        required: true,
    },
});

const accountId = computed(() => props.transactionId.split('@')[0]);
const timestamp = computed(() => props.transactionId.split('@')[1] * 1000);

const {
    data: contact,
    pending,
    error,
} = useAsyncData(
    () => `contact-${props.userId}-${accountId.value}`,
    () => $fetch(`/api/contacts/${props.userId}/${accountId.value}`),
    { watch: [accountId] }, // optional: refetch when accountId changes
);

const hue = (s) => {
    if (!s) {
        s = `0.0.${Math.floor(Math.random() * 1_000_000)}`;
    }
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash * 31 + s.charCodeAt(i)) | 0;
    }
    return 240 + (Math.abs(hash) % 60);
};
</script>
