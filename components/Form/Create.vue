<template>
    <div class="">
        <div class="flex flex-col gap-12 border border-border rounded-lg p-6 sm:p-8 bg-background">
            <div class="flex gap-16 flex-wrap flex-col-reverse md:flex-nowrap md:flex-row">
                <form class="flex flex-col gap-6 xs:w-xs">
                    <div class="flex flex-col gap-1">
                        <label for="wallet" class="text-body/50"
                            >Your Wallet Address<span class="required">*</span></label
                        >
                        <div class="relative">
                            <input
                                type="text"
                                id="wallet"
                                placeholder="0.0.12345678"
                                v-model="wallet"
                                :class="{
                                    'border-secondary!': wallet === detectedWallet,
                                }"
                            />
                            <div
                                class="absolute top-2 right-2 btn btn--transparent btn--small"
                                :class="{
                                    'is-active': wallet !== detectedWallet,
                                }"
                                @click="detectWallet"
                            >
                                Detect
                            </div>
                        </div>
                        <div class="error" v-if="!isWallet(wallet)">
                            <IconError />
                            <span>Please enter a valid wallet address</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="wallet" class="text-body/50">Amount</label>
                        <div class="relative">
                            <input type="number" min="0" id="amount" @input="(e) => setAmount(e)" :value="amount" />
                            <div class="absolute top-2 right-2">
                                <div class="flex gap-1">
                                    <span
                                        class="btn btn--transparent btn--small"
                                        :class="{
                                            'is-active': currencies.includes('hbar'),
                                        }"
                                        @click="setCurrency('hbar')"
                                        >HBAR</span
                                    >
                                    <span
                                        class="btn btn--transparent btn--small"
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
                </form>

                <div class="flex flex-col gap-8 items-center mt-4 w-[280px]">
                    <client-only>
                        <Tooltip text="This is a preview.">
                            <CardPayment
                                :amount="amount ? +amount : null"
                                :currency="currencies.length > 1 ? '*' : currencies[0]"
                                :wallet="wallet"
                                :preview="true"
                            />
                        </Tooltip>
                    </client-only>
                    <!-- <div class="flex items-center gap-3">
                    <IconShield />
                    <span>Safe payment using HashPack</span>
                </div> -->
                </div>
            </div>

            <button class="btn" :disabled="!isWallet || !isEmail" @click="handleSubmit">
                Create Payment Request Link
            </button>
        </div>

        <div
            v-if="linkId"
            class="fixed top-8 left-1/2 -translate-x-1/2 flex gap-20 p-2 pl-4 items-center rounded-sm border border-border bg-background font-medium"
        >
            <span>Payment link created!</span>
            <button class="btn btn--transparent btn--small flex gap-2 items-center cursor-pointer" @click="copyLink">
                {{ copied ? "Copied!" : "Copy link" }} <IconCopy />
            </button>

            <div class="size-8 absolute -right-4 -top-4 flex justify-center items-center" @click="linkId = null">
                <div class="size-4 rounded-full bg-primary flex justify-center items-center cursor-pointer">
                    <IconCross class="scale-75" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { HederaService } from "~/lib/hedera";

const hederaService = new HederaService();

const wallet = ref("0.0.1234567");
const amount = ref(10);
const currencies = ref(["hbar"]);
const email = ref("your@email.com");
const detectedWallet = ref(null);
const linkId = ref(null);
const copied = ref(false);

const isWallet = (wallet) => {
    // if (!wallet) return true;
    return wallet.startsWith("0.0.");
};

const isEmail = (email) => {
    // if (!email) return true;
    // if (email.length < 8) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleSubmit = async () => {
    if (!isWallet(wallet.value) || !isEmail(email.value)) {
        return;
    }

    try {
        const response = await $fetch("/api/links", {
            method: "POST",
            body: {
                accountId: wallet.value,
                email: email.value,
                amount: amount.value ? +amount.value : null,
                currency: currencies.value.length > 1 ? "*" : currencies.value[0],
            },
        });

        // get ID
        if (!response.id) {
            throw new Error("Failed to create link");
        }
        linkId.value = response.id;
    } catch (error) {
        console.error("Failed to create link:", error);
    }
};

const setAmount = (e) => {
    amount.value = +e.target.value;

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
        if (currencies.value.includes(currency) && currencies.value.length > 1) {
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

const detectWallet = async (event) => {
    event.preventDefault();
    try {
        await hederaService.initHashConnect();
        await hederaService.waitForPairing();

        if (hederaService.pairingData) {
            // get last item in array
            detectedWallet.value =
                hederaService.pairingData.accountIds[hederaService.pairingData.accountIds.length - 1];
            wallet.value = detectedWallet.value;
        }
    } catch (error) {
        console.error("Failed to detect wallet:", error);
    }
};

const copyLink = async () => {
    const paymentLink = `${window.location.origin}/pay/${linkId.value}`;

    try {
        await navigator.clipboard.writeText(paymentLink);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 5000);
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};
</script>

<style scoped></style>
