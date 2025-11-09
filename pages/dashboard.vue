<template>
    <main class="bg-background min-h-dvh">
        <div class="grid lg:grid-cols-12 gap-5 min-h-dvh p-6 pb-0">
            <div class="lg:col-span-2 h-full">
                <MobileNav />
            </div>
            <div class="lg:col-span-10 bg-dark rounded-tl-3xl rounded-tr-3xl h-full py-20 px-12 flex flex-col gap-10">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-semibold">Transactions</h1>

                    <div>B</div>
                </div>
                <div class="grid lg:grid-cols-12 gap-5">
                    <div class="lg:col-span-8">seartch</div>
                    <div class="lg:col-span-4">summary</div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import MobileNav from "../components/MobileNav.vue";

useHead({
    title: "Dashboard - HashFast",
});
</script>
