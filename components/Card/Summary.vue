<template>
    <div class="card-gradient w-full xs:w-[300px] shrink-0">
        <div class="card-gradient__blur"><div class="card-gradient__bg"></div></div>

        <div class="flex flex-col gap-8 p-6 relative z-2">
            <div class="flex w-full justify-between">
                <span class="label">HBAR Transactions</span>
                <span class="value">7</span>
            </div>
            <div class="flex w-full justify-between">
                <span class="label">Total received</span>
                <span class="value">233 HBAR</span>
            </div>
        </div>
        <div class="card-gradient__overlay"></div>
    </div>
</template>

<script setup>
const props = defineProps({});
</script>

<style scoped></style>
