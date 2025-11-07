<template>
    <main>
        <div class="container flex justify-center pt-32">
            <div v-if="link && link.id" class="flex flex-col gap-8 items-center justify-center">
                <CardPayment :wallet="link.accountId" :amount="link.amount" :currency="link.currency" />
                <div class="flex items-center gap-2">
                    <IconShield />
                    <span class="leading-[0.9]">Safe payment using HashPack</span>
                </div>
            </div>
            <div v-else>Link not found</div>
        </div>
    </main>
</template>

<script setup>
const route = useRoute();

const { data: link, pending, error } = await useAsyncData("link", () => $fetch(`/api/links/${route.params.slug}`));
</script>
