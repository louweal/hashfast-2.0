<template>
    <NuxtLink
        to="/account"
        class="account-button rounded-full size-12 text-3xl flex justify-center items-center font-medium text-white opacity-60 hover:opacity-100 duration-300 ease-in-out"
    >
        {{ userInitial.toUpperCase() }}
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
}
</style>
