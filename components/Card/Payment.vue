<template>
    <div class="payment" :class="{ 'payment--preview': preview, isFlipping: isFlipping }">
        <div class="payment__blur"><div class="payment__bg"></div></div>

        <div class="flex flex-col gap-12 p-6 relative z-2">
            <div class="flex justify-between items-center gap-4">
                <IconLogo />

                <div @click="flipCard" class="cursor-pointer opacity-80 hover:opacity-100 size-5">
                    <IconQR v-if="showFront" />

                    <IconCross v-else :size="20" />
                </div>
            </div>

            <form @submit.prevent="handlePayment" class="flex flex-col gap-5" v-if="showFront" key="front">
                <div class="flex w-full justify-between">
                    <span class="label">Receiver</span>
                    <span class="value" v-if="wallet">{{ wallet }}</span>
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
                            <input type="number" min="0" id="amount" placeholder="..." class="w-full min-w-0" />
                            <div class="absolute top-2 right-2">
                                <div class="flex gap-1">
                                    <span
                                        class="btn btn--transparent btn--small"
                                        :class="{
                                            'is-active': currency === 'hbar' || currency === '*',
                                        }"
                                        >HBAR</span
                                    >
                                    <span
                                        class="btn btn--transparent btn--small"
                                        :class="{
                                            'is-active': currency === 'usdc' || currency === '*',
                                        }"
                                        >USDC</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn">Pay now</button>
            </form>
            <div class="bg-white" key="back" v-else>
                <QrCode />
            </div>
        </div>
        <div class="payment__overlay"></div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
    wallet: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        required: true,
    },
    preview: {
        type: Boolean,
        default: false,
    },
});

const showFront = ref(true);
const isFlipping = ref(false);

function flipCard() {
    showFront.value = !showFront.value;
    isFlipping.value = true;

    setTimeout(() => {
        isFlipping.value = false;
    }, 300);
}

const handlePayment = () => {
    // TODO
};
</script>

<style scoped>
.payment {
    position: relative;
    width: 280px;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid var(--color-border) !important;

    &.payment--preview {
        &:hover {
            .payment__overlay {
                visibility: visible;
                opacity: 0.3;
            }
        }
    }

    .payment__bg {
        position: absolute;
        inset: 0;
        background-image: url("/images/card-bg.png");
        background-repeat: repeat;
        background-size: cover;
        background-size: 160%;
        background-position: 70% 10%;
        animation: moveBg 60s cubic-bezier(0.98, 0, 0, 1) infinite alternate;
    }

    .payment__blur {
        position: absolute;
        inset: 0;
        background-color: rgba(17, 24, 39, 0.4);
        filter: blur(28px);
        -webkit-filter: blur(28px);
    }

    .payment__overlay {
        position: absolute;
        inset: 0;
        background-color: #111827;
        visibility: hidden;
        opacity: 0;
        z-index: 2;
        transition: opacity 0.3s cubic-bezier(0.2, 0, 0.2, 1);
    }

    .label {
        opacity: 0.5;
        font-size: 14px;
        color: var(--color-heading);
    }

    .value {
        font-size: 14px;
        letter-spacing: 4px;
        font-weight: 500;
    }

    /* transition: transform 0.3s cubic-bezier(0.2, 0, 0.2, 1);
    transform-origin: center; */
    perspective: 1000px;
    transform-origin: center;
    backface-visibility: hidden;

    &.isFlipping {
        animation: flip3d 0.3s cubic-bezier(0.2, 0, 0.2, 1);
    }
}

@keyframes flip3d {
    0% {
        transform: rotateY(0);
        opacity: 1;
    }
    50% {
        transform: rotateY(60deg);
        opacity: 0;
    }
    100% {
        transform: rotateY(0);
        opacity: 1;
    }
}

@keyframes moveBg {
    to {
        transform: rotate(-360deg) scale(-1);
    }
}
</style>
