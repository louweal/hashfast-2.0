<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" fill="none" class="icon-trash">
        <path
            :fill="color"
            fill-rule="evenodd"
            d="m1.592 3.539.773 11.8a.69.69 0 0 0 .68.661h7.911a.69.69 0 0 0 .68-.662l.773-11.8H1.592ZM.523 2.472c-.697 0-.697-1.066 0-1.066h4.015l.42-1.12A.396.396 0 0 1 5.339 0h3.323c.16 0 .31.1.37.259l.43 1.147h4.016c.697 0 .697 1.066 0 1.066H.523Zm7.674 10.394.316-7.183c.03-.699 1.086-.653 1.055.046l-.316 7.183c-.03.7-1.085.653-1.055-.046Zm-3.763-7.09c-.03-.7 1.025-.746 1.055-.046l.314 7.137c.03.698-1.025.746-1.055.046l-.314-7.137Z"
            clip-rule="evenodd"
        />
    </svg>
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: "#D1D5DB",
    },
});
</script>

<style scoped>
.icon-trash {
    transition: filter 0.2s cubic-bezier(0.2, 0, 0.2, 1);
    &:hover {
        filter: brightness(1.25);
    }
}
</style>
