<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-12 border border-border rounded-lg p-8 bg-background">
        <div class="flex gap-16 flex-wrap flex-col-reverse md:flex-nowrap md:flex-row">
            <div class="flex flex-col gap-6 xs:w-xs">
                <div class="flex flex-col gap-1">
                    <label for="wallet" class="text-sm text-body/50"
                        >Your Wallet Address<span class="required">*</span></label
                    >
                    <div class="relative">
                        <input type="text" id="wallet" placeholder="0.0.12345678" v-model="wallet" />
                        <div class="absolute top-2 right-2 btn btn--small">Detect</div>
                    </div>
                    <div class="error" v-if="!isWallet(wallet)">
                        <IconError />
                        <span>Please enter a valid wallet address</span>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="wallet" class="text-sm text-body/50">Amount</label>
                    <div class="relative">
                        <input type="number" min="0" id="amount" @input="(e) => setAmount(e)" />
                        <div class="absolute top-2 right-2">
                            <div class="flex gap-1">
                                <span
                                    class="btn btn--small"
                                    :class="{
                                        'is-active': currencies.includes('hbar'),
                                    }"
                                    @click="setCurrency('hbar')"
                                    >HBAR</span
                                >
                                <span
                                    class="btn btn--small"
                                    :class="{
                                        'is-active': currencies.includes('usdc'),
                                    }"
                                    @click="setCurrency('usdc')"
                                    >USDC</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label for="email" class="flex items-center gap-1 leading-[0.9]">
                        <span>Email<span class="required">*</span></span>
                        <Tooltip text="You get an email notification whenever you receive payment.">
                            <IconQuestion />
                        </Tooltip>
                    </label>
                    <div class="relative">
                        <input type="email" id="email" v-model="email" required />
                    </div>
                    <div class="error" v-if="!isEmail(email)">
                        <IconError />

                        <span>Please enter a valid email address</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-8 items-center mt-4">
                <client-only>
                    <Tooltip text="This is a preview.">
                        <div class="preview">
                            <div class="preview__bg"></div>
                            <div class="preview__blur"></div>

                            <div class="flex flex-col gap-12 p-6 relative z-2">
                                <div class="flex justify-between gap-4">
                                    <IconLogo />

                                    <IconQR />
                                </div>

                                <div class="flex flex-col gap-5">
                                    <div class="flex w-full justify-between" v-if="wallet">
                                        <span class="label">Receiver</span>
                                        <span class="value">{{ wallet }}</span>
                                    </div>
                                    <div class="flex w-full justify-between" v-if="amount != ''">
                                        <span class="label">Amount</span>
                                        <span class="value"
                                            >{{ amount }}
                                            <span v-if="currencies.length === 1">{{
                                                currencies[0].toUpperCase()
                                            }}</span></span
                                        >
                                    </div>
                                    <div v-else>
                                        <div class="flex flex-col w-full items-start">
                                            <span class="label">Amount</span>
                                            <div class="relative w-full">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    id="preview-amount"
                                                    v-model="amount"
                                                    disabled
                                                    class="w-full min-w-0"
                                                />
                                                <div class="absolute top-2 right-2">
                                                    <div class="flex gap-1">
                                                        <span
                                                            class="btn btn--small"
                                                            :class="{
                                                                'is-active': currencies.includes('hbar'),
                                                            }"
                                                            @click="setCurrency('hbar')"
                                                            >HBAR</span
                                                        >
                                                        <span
                                                            class="btn btn--small"
                                                            :class="{
                                                                'is-active': currencies.includes('usdc'),
                                                            }"
                                                            >USDC</span
                                                        >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn">Pay now</button>
                                </div>
                            </div>
                            <div class="preview__overlay"></div>
                        </div>
                    </Tooltip>
                </client-only>
                <!-- <div class="flex items-center gap-3">
                    <IconShield />
                    <span>Safe payment using HashPack</span>
                </div> -->
            </div>
        </div>

        <button class="btn" :disabled="!wallet || !email || !isWallet || !isEmail">Create Payment Request Link</button>
    </form>
</template>

<script setup>
import { ref } from "vue";

const wallet = ref("0.0.1234567");
const amount = ref("");
const currencies = ref(["hbar"]);
const email = ref("your@email.com");

const isWallet = (wallet) => {
    if (!wallet) return true;
    return wallet.startsWith("0.0.");
};

const isEmail = (email) => {
    if (!email) return true;
    if (email.length < 8) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const errorWallet = ref(false);
const errorEmail = ref(false);

const handleSubmit = () => {};

const setAmount = (e) => {
    amount.value = e.target.value;

    if (amount.value && currencies.value.length > 1) {
        currencies.value = ["hbar"];
    }
};

const setCurrency = (currency) => {
    // push currency to currencies array

    if (amount.value && amount.value != 0) {
        // switch currency
        currencies.value = [currency];
    } else {
        // check if currency is already in currencies array
        if (currencies.value.includes(currency)) {
            // remove currency
            currencies.value = currencies.value.filter((c) => c !== currency);
        } else {
            // add currency
            currencies.value.push(currency);
        }
    }

    // remove duplicates
    currencies.value = [...new Set(currencies.value)];
};
</script>

<style scoped>
.preview {
    position: relative;
    width: 280px;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid var(--color-border) !important;

    /* input[type="number"] {
        @media (min-width: 64rem) {
            border: 1px solid gold !important;
            width: 100% !important;
            min-width: 0;
        }
    } */

    &:hover {
        .preview__overlay {
            opacity: 0.3;
        }

        /* .preview__bg {
            animation-play-state: paused;
        } */
    }

    .preview__bg {
        position: absolute;
        inset: 0;
        background-image: url("/images/card-bg.png");
        background-repeat: repeat;
        background-size: cover;
        background-size: 160%;
        background-position: 70% 10%;
        animation: move 60s cubic-bezier(0.98, 0, 0, 1) infinite alternate;
    }

    .preview__blur {
        position: absolute;
        /* opacity: 0; */
        inset: 0;
        background-color: rgba(17, 24, 39, 0.4);
        backdrop-filter: blur(28px);
        -webkit-backdrop-filter: blur(28px);
    }

    .preview__overlay {
        position: absolute;
        inset: 0;
        background-color: #111827;
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
        font-weight: 600;
    }
}

@keyframes move {
    to {
        transform: rotate(-360deg) scale(-1);
    }
}
</style>
