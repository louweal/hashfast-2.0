<template>
    <NuxtLink :to="homeUrl" class="logo flex gap-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="24" fill="none" class="shrink-0">
            <path
                class="flash"
                fill="#fff"
                d="M19.235 1.9a9.261 9.261 0 1 1 0 18.523 9.261 9.261 0 0 1 0-18.523Zm-2.232 3.324-2.66 7.98h5.32l-2.66 5.319 7.979-7.98h-5.32l2.66-5.319h-5.319Z"
            />
            <path
                fill="#fff"
                d="M2.492 6.978h6.581a9.192 9.192 0 0 0-.878 2.688H2.61v3.693H8.34a9.204 9.204 0 0 0 1.121 2.675H2.492v7.15H0V0h2.492v6.978Zm10.972 12.596a9.188 9.188 0 0 0 2.492.745v2.866h-2.492v-3.61Zm2.492-17.572a9.19 9.19 0 0 0-2.492.746V0h2.492v2.002Z"
            />
        </svg>
        <span class="font-medium text-2xl">HashFast</span>
    </NuxtLink>
</template>

<script setup>
const props = defineProps({
    homeUrl: {
        type: String,
        default: '/',
    },
});
</script>

<style scoped>
.logo {
    width: 141px;
    height: 24px;

    &:hover {
        .flash {
            animation: flip 0.5s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }
    }

    .flash {
        transform-origin: center;
        transform-box: fill-box;
    }
}

@keyframes flip {
    0% {
        transform: scaleX(1);
    }
    50% {
        transform: scaleX(-1);
    }
    100% {
        transform: scaleX(1);
    }
}
</style>
