<template>
    <NuxtLink
        to="/account"
        class="account-button rounded-full size-14 text-3xl flex justify-center items-center font-bold text-white"
    >
        {{ userInitial }}
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    userInitial: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.account-button {
    background: radial-gradient(88.39% 88.39% at 61.67% 42.5%, #40316b 0%, #327687 100%);
    /* stroke-width: 1px; */
    /* stroke: #313b4b; */
    border: 1px solid #313b4b;
    transition: border-color 0.3s cubic-bezier(0.2, 0, 0.2, 1);

    &:hover {
        border-color: var(--color-heading) !important;
    }
}
</style>
