<template>
    <div
        class="bg-background border border-border rounded-2xl w-full transition-colors duration-30 animate-slide-up"
        :class="{
            'cursor-pointer hover:bg-background/50': handleCopy,
        }"
        @click="handleCopy ? handleCopy(id) : null"
    >
        <div class="p-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <div class="flex justify-between items-center">
                    <h3 class="font-medium text-lg">{{ name }}</h3>

                    <Tooltip :text="archived || (expires && new Date(expires) < new Date()) ? 'Delete' : 'Archive'">
                        <div
                            class="flex shrink-0 justify-center items-center p-2 cursor-pointer"
                            @click.stop="handleDelete(id)"
                        >
                            <IconTrash
                                :color="archived || (expires && new Date(expires) < new Date()) ? '#fb7185' : undefined"
                            />
                        </div>
                    </Tooltip>
                </div>

                <p class="opacity-50 color-heading">{{ memo }}</p>
            </div>

            <div class="flex flex-col gap-6">
                <div class="flex justify-between">
                    <span>Amount</span>
                    <span class="text-wide font-base font-medium" v-if="amount != 0">
                        {{ amount }} <span v-if="currency">{{ currency.toUpperCase() }}</span>
                    </span>
                    <span v-else>Open</span>
                </div>
                <div class="flex justify-between">
                    <span>Receiver</span>
                    <span class="text-wide font-base font-medium">
                        {{ accountId }}
                    </span>
                </div>
                <div class="flex justify-between" v-if="expires">
                    <span>{{ expires && new Date(expires) < new Date() ? 'Expired' : 'Expires' }}</span>
                    <span class="text-wide font-base font-medium">
                        {{ new Date(expires).toLocaleString() }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="payments && payments.length > 0" class="card-gradient no-animation -m-px">
            <div class="card-gradient__blur"><div class="card-gradient__bg"></div></div>

            <div class="flex flex-col gap-5 p-6 py-8 relative z-2">
                <div class="flex w-full justify-between">
                    <span class="label">Payments</span>
                    <span class="value">{{ payments.length }}</span>
                </div>
                <div class="flex w-full justify-between" v-if="totalHBARAmount > 0">
                    <span class="label">Received</span>
                    <span class="value">{{ totalHBARAmount }} HBAR</span>
                </div>
                <div class="flex w-full justify-between" v-if="totalUSDCAmount > 0">
                    <span class="label" v-if="totalHBARAmount == 0">Received</span>
                    <span class="value">{{ totalUSDCAmount }} USDC</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { HederaService } from '~/lib/hedera';

const hederaService = new HederaService();

const copied = ref(false);

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    memo: {
        type: String,
        required: false,
    },
    expires: {
        type: String,
        required: false,
    },
    amount: {
        type: String,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    archived: {
        type: Boolean,
        required: false,
    },
    accountId: {
        type: String,
        required: false,
    },
    payments: {
        type: Array,
        required: false,
    },
    handleDelete: {
        type: Function,
        required: true,
    },
    handleCopy: {
        type: Function,
        required: false,
    },
});

const paymentIds = props.payments.map((payment) => payment.transactionId);

const totalHBARAmount = ref(await hederaService.getTotalHBARTransactionAmount(paymentIds, props.accountId));
const totalUSDCAmount = ref(await hederaService.getTotalUSDCTransactionAmount(paymentIds, props.accountId));

// const copyLink = async () => {
//     copied.value = false;
//     const linkUrl = `${window.location.origin}/pay/${props.id}`;

//     try {
//         await navigator.clipboard.writeText(linkUrl);
//         copied.value = true;

//         setTimeout(() => {
//             copied.value = false;
//         }, 5000);
//     } catch (err) {
//         console.error('Failed to copy:', err);
//     }
// };
</script>
