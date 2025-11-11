<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        viewBox="0 0 25 20"
        fill="none"
        class="logo"
    >
        <g fill="#F9FAFB" opacity="1">
            <path
                class="flash"
                d="M16.593 1.639a7.99 7.99 0 1 1 0 15.978 7.99 7.99 0 0 1 0-15.978Zm-1.926 2.868-2.294 6.883h4.59l-2.296 4.589 6.883-6.883h-4.588l2.294-4.589h-4.589Z"
            />
            <path
                d="M2.15 6.02h5.677a7.929 7.929 0 0 0-.758 2.318H2.252v3.186h4.941c.202.828.532 1.604.968 2.308h-6.01V20H0V0h2.15v6.02Zm9.464 10.865c.672.31 1.394.53 2.15.643V20h-2.15v-3.115Zm2.15-15.158a7.93 7.93 0 0 0-2.15.643V0h2.15v1.727Z"
            />
        </g>
    </svg>
</template>

<script setup>
const props = defineProps({
    width: {
        // width
        type: Number,
        default: 25,
    },
    height: {
        // height
        type: Number,
        default: 20,
    },
});
</script>

<style scoped>
.logo {
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
