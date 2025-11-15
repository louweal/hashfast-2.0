<template>
    <div class="">
        <div class="flex flex-col gap-12 border border-border rounded-lg p-6 sm:p-8 bg-background">
            <div class="flex gap-16 flex-wrap flex-col-reverse md:flex-nowrap md:flex-row w-full">
                <form class="flex flex-col gap-6 xs:w-xs">
                    <div class="flex flex-col gap-1" v-if="pro">
                        <label for="name" class="text-body/50">Description </label>
                        <div class="relative">
                            <input type="text" id="name" v-model="name" placeholder="Drinks" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="wallet" class="text-body/50">Amount</label>
                        <div class="relative">
                            <input
                                type="number"
                                min="0"
                                id="amount"
                                @input="(e) => setAmount(e)"
                                :value="amount"
                                :min="minAmount"
                            />
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
                        <div class="error" v-if="amount && amount < minAmount">
                            <IconError />
                            <span>The minimum amount is {{ minAmount }} {{ currency.toUpperCase() }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="wallet" class="text-body/50"
                            >Your Wallet Address<span class="required">*</span></label
                        >
                        <div class="relative">
                            <input
                                type="text"
                                id="wallet"
                                v-model="wallet"
                                placeholder="0.0.1234567"
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

                    <div class="flex flex-col gap-1" v-if="pro">
                        <label for="expires" class="flex items-center gap-1 leading-[0.9]">Expiration Date</label>
                        <div class="relative">
                            <input type="date" id="expires" v-model="expires" :min="today" />
                        </div>
                        <div class="error" v-if="expires < today">
                            <IconError />
                            <span>Invalid expiration date</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-1" v-if="pro">
                        <label for="memo" class="flex items-center gap-1 leading-[0.9]">
                            <span>Memo</span>
                        </label>
                        <div class="relative">
                            <input type="text" id="memo" v-model="memo" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1" v-if="!pro">
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

                <div class="flex flex-col gap-1 items-center w-full xs:w-[300px]">
                    <div class="text-sm text-center opacity-30">Preview:</div>
                    <CardPayment
                        :image="image"
                        :name="name"
                        :expires="expires"
                        :memo="memo"
                        :amount="amount ? +amount : null"
                        :currency="currencies.length > 1 ? '*' : currencies[0]"
                        :accountId="wallet"
                        :preview="true"
                    />

                    <div class="flex items-center gap-3 mt-4" v-if="pro">
                        <div class="flex items-center gap-1 text-sm opacity-50 text-center">
                            <p>
                                Fees apply for
                                <NuxtLink to="/pro" class="font-medium text-secondary">Pro</NuxtLink> users.
                            </p>
                            <Tooltip
                                :text="`Fee: $0.01. Paid in ${
                                    currency === '*' ? 'HBAR or USDC' : currency.toUpperCase()
                                }.`"
                            >
                                <IconQuestion />
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>

            <button
                class="btn"
                :disabled="
                    !isWallet(wallet) ||
                    (!pro && !isEmail(email)) ||
                    !isValidDate(expires) ||
                    (amount && amount < minAmount)
                "
                @click="handleSubmit"
            >
                Create Payment Request Link
            </button>

            <div
                v-if="linkId"
                class="flex justify-between gap-3 lg:gap-20 p-2 pl-4 items-center rounded-sm border border-secondary bg-background font-medium"
            >
                <span>Payment link created!</span>
                <button
                    class="btn btn--transparent btn--small flex gap-2 items-center cursor-pointer"
                    @click="copyLink"
                >
                    {{ copied ? 'Copied!' : 'Copy link' }} <IconCopy />
                </button>

                <div class="size-8 absolute -right-4 -top-4 flex justify-center items-center" @click="linkId = null">
                    <div
                        class="size-4 rounded-full bg-dark border border-white flex justify-center items-center cursor-pointer"
                    >
                        <IconCross class="scale-75" />
                    </div>
                </div>
            </div>
        </div>

        <!-- <div
            v-if="linkId"
            class="fixed top-64 lg:top-8 left-1/2 -translate-x-1/2 min-w-72! xs:w-120 flex justify-between gap-3 lg:gap-20 p-2 pl-4 items-center rounded-sm border border-secondary bg-background font-medium z-5"
        >
            <span>Payment link created!</span>
            <button class="btn btn--transparent btn--small flex gap-2 items-center cursor-pointer" @click="copyLink">
                {{ copied ? 'Copied!' : 'Copy link' }} <IconCopy />
            </button>

            <div class="size-8 absolute -right-4 -top-4 flex justify-center items-center" @click="linkId = null">
                <div
                    class="size-4 rounded-full bg-dark border border-white flex justify-center items-center cursor-pointer"
                >
                    <IconCross class="scale-75" />
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { HederaService } from '~/lib/hedera';

const hederaService = new HederaService();

const props = defineProps({
    pro: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: String,
        default: null,
    },
    accountId: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
});

const name = ref(null);
const memo = ref('');
const expires = ref(null);
const wallet = ref(props.accountId || '0.0.1234567');
const amount = ref(10);
const currencies = ref(['hbar']);
const email = ref('your@email.com');
const detectedWallet = ref(null);
const linkId = ref(null);
const copied = ref(false);

const currency = computed(() => {
    if (currencies.value.length > 1) return '*';
    return currencies.value[0];
});

const minAmount = computed(() => {
    if (!props.pro) return 0;
    if (currency.value === 'usdc') return usdFee.value * 2;
    return hbarFee.value * 2;
});

const today = computed(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

const usdFee = ref('0.01');
const hbarFee = ref((usdFee.value / (await hederaService.hbarPrice())).toFixed(5));

const isWallet = (wallet) => {
    if (!wallet) return false;
    return wallet.startsWith('0.0.');
};

const isEmail = (email) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDate = (date) => {
    if (!date) return true;
    return date >= today.value;
};

const handleSubmit = async () => {
    if (!isWallet(wallet.value) || !isEmail(email.value)) {
        return;
    }

    const body = {
        name: name.value,
        memo: memo.value,
        expires: expires.value ? new Date(expires.value) : null,
        accountId: wallet.value,
        email: props.pro ? props.email : email.value,
        amount: amount.value ? +amount.value : null,
        currency: currencies.value.length > 1 ? '*' : currencies.value[0],
    };

    if (props.userId) {
        body['user'] = { connect: { id: props.userId } };
    }

    try {
        const response = await $fetch('/api/links', {
            method: 'POST',
            body: body,
        });

        // get ID
        if (!response.id) {
            throw new Error('Failed to create link');
        }
        linkId.value = response.id;

        // copy link
        copyLink();

        // reset form
        name.value = null;
        memo.value = '';
        expires.value = null;
        wallet.value = props.accountId || '0.0.1234567';
        amount.value = 10;
        currencies.value = ['hbar'];
        email.value = 'your@email.com';
    } catch (error) {
        console.error('Failed to create link:', error);
    }
};

const setAmount = (e) => {
    amount.value = +e.target.value;

    if (amount.value && currencies.value.length > 1) {
        currencies.value = ['hbar'];
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
        console.error('Failed to detect wallet:', error);
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
        console.error('Failed to copy:', err);
    }
};
</script>

<style scoped></style>
