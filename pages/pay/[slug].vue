<template>
    <main>
        <div class="container flex justify-center pt-32">
            <div v-if="link && link.id" class="flex flex-col gap-8 items-center justify-center w-full">
                <!-- <div class="btn" @click="sendEmail('0.0.4505361@1762693361.955169462')">Send Test Email</div> -->
                <CardPayment
                    v-bind="publicLink"
                    :handlePayment="handlePayment"
                    :isPaid="isPaid"
                    :image="user ? user.image : null"
                />

                <div
                    v-if="isPaid"
                    class="thank-you w-full xs:w-[300px] rounded-lg border border-border p-6 bg-background flex flex-col gap-5"
                >
                    <h3 class="font-semibold text-lg">Thank you for using HashFast</h3>
                    <p>Did you know that you can create your own payment request links to share with others?</p>

                    <p>It's 100% free and no sign up required.</p>
                    <NuxtLink to="/" class="btn btn-primary w-full">Discover HashFast</NuxtLink>
                </div>
                <!-- <div class="flex items-center gap-2" v-else>
                    <IconShield />
                    <span class="leading-[0.9]">Safe payment using HashPack</span>
                </div> -->
            </div>
            <div v-else>Link not found</div>
        </div>
    </main>
</template>

<script setup>
import { HederaService } from '~/lib/hedera';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const hederaService = new HederaService();

const route = useRoute();

const { data: link, pending, error } = await useAsyncData('link', () => $fetch(`/api/links/${route.params.slug}`));
const { data: user } = await useAsyncData('user', () => $fetch('/api/users/' + link.value.userId));

const isPaid = ref(false);

// link without email
const publicLink = computed(() => {
    return {
        ...link.value,
        amount: +link.value.amount,
        email: null,
        createdAt: null,
        updatedAt: null,
    };
});

const handlePayment = async (inputAmount, inputCurrency) => {
    if (inputAmount) {
        link.value.amount = inputAmount;
    }

    if (link.value.currency !== inputCurrency) {
        link.value.currency = inputCurrency;
    }

    try {
        const pro = link.value.userId ? true : false;
        const response = await hederaService.sendPayment(link.value, pro);

        if (typeof response !== 'object') {
            throw new Error(response);
        }

        const { transactionId, receipt } = response;

        if (receipt.status._code === 22) {
            isPaid.value = true;
            try {
                await $fetch('/api/payments', {
                    method: 'POST',
                    body: { transactionId, linkId: link.value.id, userId: link.value.userId },
                });
            } catch (storeErr) {
                console.error('Failed to store payment:', storeErr);
            }

            // send email
            if (link.value.email) {
                sendEmail(transactionId);
            }
        } else {
            console.log('Payment receipt:', receipt);
        }
    } catch (err) {
        console.error('Failed to send payment:', err);
    }
};

const sendEmail = async (transactionId) => {
    const [payerAccountId, timestampPart] = transactionId.split('@');
    const timestampInSeconds = timestampPart.split('.')[0] * 1000;
    const paymentDate = new Date(timestampInSeconds).toLocaleString('en-US');

    try {
        // post to api/send-email
        await $fetch('/api/send-email', {
            method: 'POST',
            body: {
                email: link.value.email,
                payerAccountId,
                accountId: link.value.accountId,
                paymentDate,
                amount: link.value.amount,
                currency: link.value.currency.toUpperCase(),
            },
        });
    } catch (err) {
        console.error('Failed to send email:', err);
    }
};
</script>

<style scoped>
.thank-you {
    /* width: min(calc(100vw - 2rem), 280px); */
}
</style>
