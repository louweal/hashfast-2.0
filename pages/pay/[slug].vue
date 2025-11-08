<template>
    <main>
        <div class="container flex justify-center pt-32">
            <div v-if="link && link.id" class="flex flex-col gap-8 items-center justify-center">
                <CardPayment v-bind="publicLink" :handlePayment="handlePayment" :isPaid="isPaid" />

                <div
                    v-if="isPaid"
                    class="thank-you rounded-lg border border-border p-6 bg-background flex flex-col gap-5"
                >
                    <h3 class="font-semibold text-lg">Thank you for using HashFast</h3>
                    <p>Did you know that you can create your own payment request links to share with others?</p>

                    <p>It's 100% free and no sign up required.</p>
                    <NuxtLink to="/" class="btn btn-primary w-full">Discover HashFast</NuxtLink>
                </div>
                <div class="flex items-center gap-2" v-else>
                    <IconShield />
                    <span class="leading-[0.9]">Safe payment using HashPack</span>
                </div>
            </div>
            <div v-else>Link not found</div>
        </div>
    </main>
</template>

<script setup>
import { HederaService } from "~/lib/hedera";

const hederaService = new HederaService();

const route = useRoute();

const { data: link, pending, error } = await useAsyncData("link", () => $fetch(`/api/links/${route.params.slug}`));
const isPaid = ref(false);

// link without email
const publicLink = computed(() => {
    return {
        ...link.value,
        email: null,
        createdAt: null,
        updatedAt: null,
    };
});

console.log(link.value);

const handlePayment = async () => {
    // console.log("handle payment!");
    // return;
    try {
        const response = await hederaService.sendPayment(link.value);

        if (typeof response !== "object") {
            throw new Error(response);
        }

        const { transactionId, receipt } = response;

        if (receipt.status._code === 22) {
            isPaid.value = true;
            try {
                await $fetch("/api/payments", {
                    method: "POST",
                    body: { transactionId, linkId: link.value.id },
                });
            } catch (storeErr) {
                console.error("Failed to store payment:", storeErr);
            }
        } else {
            console.log("Payment receipt:", receipt);
        }
    } catch (err) {
        console.error("Failed to send payment:", err);
    }
};
</script>

<style scoped>
.thank-you {
    width: min(calc(100vw - 2rem), 280px);
}
</style>
