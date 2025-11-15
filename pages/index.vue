<template>
    <main>
        <Header />

        <div class="btn" @click="test()">Connect wallet</div>

        <Hero
            title="Fast payments for everyone"
            description="Quickly receive HBAR and USDC on Hedera from anyone."
            :links="[{ title: 'Create new link', url: '/create' }]"
        />
        <CTA
            title="Upgrade to Pro"
            description="Create advanced payment requests with custom descriptions, expiration dates, memos, and your own logo. Plus, get a clean dashboard to track every request and every payment — all in one place."
            :links="[{ title: 'Learn more', url: '/pro' }]"
            image="/images/create-pro.png"
        />

        <Footer />
    </main>
</template>

<script setup>
import { HederaService } from '~/lib/hedera';
const hederaService = new HederaService();

useHead({
    title: 'HashFast',
});

const test = async () => {
    // init dappconnector
    await hederaService.initDAppConnector();
};
</script>
