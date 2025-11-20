<template>
    <div class="card-gradient w-[300px]" :class="{ 'card-gradient--preview': preview, isFlipping: isFlipping }">
        <div class="card-gradient__blur"><div class="card-gradient__bg"></div></div>

        <div
            v-if="archived || (expires && new Date(expires) < new Date())"
            class="flex flex-col gap-12 p-6 relative z-2 text-center font-medium"
        >
            <p>This payment request is no longer active.</p>
        </div>
        <div v-else class="flex flex-col gap-12 p-6 relative z-2">
            <div class="flex justify-between items-center gap-4">
                <div v-if="image" class="">
                    <img class="opacity-80 h-5" :src="image" height="20" />
                </div>
                <IconLogo class="opacity-80" v-else />

                <div v-if="!isPaid" @click="flipCard" class="cursor-pointer opacity-80 hover:opacity-100 size-5">
                    <IconQR v-if="showFront" />

                    <IconCross v-else :size="20" />
                </div>
            </div>

            <form
                @submit.prevent="handlePayment(inputAmount, inputCurrency)"
                class="flex flex-col gap-5"
                v-if="showFront"
                key="front"
            >
                <p class="text-lg text-center" v-if="name">{{ name }}</p>
                <div class="flex w-full justify-between" v-if="expires">
                    <span class="label">Expires</span>
                    <span class="value">{{ new Date(expires).toLocaleDateString('en-US') }}</span>
                </div>
                <div class="flex w-full justify-between">
                    <span class="label">Receiver</span>
                    <a
                        class="value hover:opacity-75 transition-opacity duration-300 ease-in-out"
                        v-if="accountId"
                        :href="`https://hashscan.io/${network}/account/${accountId}/operations`"
                        target="_blank"
                        >{{ accountId }}</a
                    >
                </div>

                <div class="flex w-full justify-between" v-if="amount">
                    <span class="label">Amount</span>
                    <span class="value"
                        >{{ amount }} <span v-if="currency !== '*'">{{ currency.toUpperCase() }}</span></span
                    >
                </div>
                <div v-else>
                    <div class="flex flex-col w-full items-start">
                        <span class="label">Amount</span>
                        <div class="relative w-full">
                            <input
                                type="number"
                                min="0"
                                id="amount"
                                step="any"
                                v-model="inputAmount"
                                placeholder="..."
                                class="w-full min-w-0"
                                required
                            />
                            <div class="absolute top-2 right-2">
                                <div class="flex gap-1">
                                    <span
                                        v-if="currency === 'hbar' || currency === '*'"
                                        class="btn btn--transparent btn--small"
                                        :class="{
                                            'is-active': inputCurrency === 'hbar',
                                        }"
                                        @click="inputCurrency = 'hbar'"
                                        >HBAR</span
                                    >
                                    <span
                                        v-if="currency === 'usdc' || currency === '*'"
                                        class="btn btn--transparent btn--small"
                                        :class="{
                                            'is-active': inputCurrency === 'usdc',
                                        }"
                                        @click="inputCurrency = 'usdc'"
                                        >USDC</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="error" v-if="!inputAmount">
                            <IconError />
                            <p class="text-error">Please enter an amount</p>
                        </div>
                    </div>
                </div>
                <div v-if="isPaid"><p class="text-lg text-secondary text-center">Payment received!</p></div>
                <button v-else class="btn">Pay now</button>
            </form>
            <div class="bg-white flex justify-center items-center" key="back" v-else>
                <QrCode />
            </div>
        </div>
        <div class="card-gradient__overlay"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();
const network = config.public.hederaNetwork;

const props = defineProps({
    accountId: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        default: null,
    },
    currency: {
        type: String,
        required: true,
    },
    expires: {
        type: String,
        required: false,
    },
    archived: {
        type: Boolean,
        default: false,
    },
    memo: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    preview: {
        type: Boolean,
        default: false,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    handlePayment: {
        type: Function,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
});

const showFront = ref(true);
const isFlipping = ref(false);
const inputAmount = ref(1);
const inputCurrency = ref(props.currency);

function flipCard() {
    showFront.value = !showFront.value;
    isFlipping.value = true;

    setTimeout(() => {
        isFlipping.value = false;
    }, 300);
}
</script>
