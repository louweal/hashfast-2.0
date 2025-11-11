<template>
    <div
        class="fixed inset-0 bg-background p-6 flex flex-col gap-10 justify-between z-10 h-dvh lg:w-[16vw] opacity-0 invisible lg:opacity-100 lg:visible transition-opacity duration-300 ease-in-out"
        :class="{ 'opacity-100 visible': active }"
    >
        <div class="flex flex-col gap-10">
            <NuxtLink to="/">
                <IconLogo :width="67" :height="55" />
            </NuxtLink>

            <ul class="flex flex-col gap-5 text-lg font-bold">
                <li
                    class="opacity-60 hover:opacity-100 transition-opacity duration-300"
                    :class="{ 'opacity-100': activeLink === 'links' }"
                >
                    <NuxtLink to="/dashboard/links" class="flex items-center gap-4">
                        <!-- <IconLink /> -->
                        Links
                    </NuxtLink>
                </li>
                <li
                    class="opacity-60 hover:opacity-100 transition-opacity duration-300"
                    :class="{ 'opacity-100': activeLink === 'transactions' }"
                >
                    <NuxtLink to="/dashboard/transactions" class="flex items-center gap-4 text-lg font-medium">
                        <!-- <IconTransaction /> -->
                        Transactions
                    </NuxtLink>
                </li>
            </ul>
        </div>
        <div class="btn" @click="handleSignOut()">Sign out</div>
    </div>
</template>

<script setup>
const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    activeLink: {
        type: String,
        default: "links",
    },
    handleSignOut: {
        type: Function,
        default: () => {},
    },
});
</script>
