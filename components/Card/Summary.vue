<template>
    <div class="card-gradient w-full xs:w-[300px] shrink-0">
        <div class="card-gradient__blur"><div class="card-gradient__bg"></div></div>

        <div class="flex flex-col gap-5 p-6 py-8 relative z-2">
            <div class="flex w-full justify-between">
                <span class="label">{{ currency.toUpperCase() }} Transactions</span>
                <span class="value">{{ numTransactions }}</span>
            </div>
            <div class="flex w-full justify-between">
                <span class="label">Total received</span>
                <span class="value">{{ sumAmount }} {{ currency.toUpperCase() }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    numTransactions: {
        type: Number,
        default: 0,
    },
    sumAmount: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: "hbar",
    },
});
</script>

<style scoped></style>
