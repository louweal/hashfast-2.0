<template>
    <main>
        <Header />

        <Hero
            title="Fast payments for everyone"
            description="Safely receive HBAR and USDC on Hedera from anyone."
            :links="[
                { title: 'Create new link', url: '/create' },
                { title: 'More features', url: '/pro' },
            ]"
        />

        <Footer />
    </main>
</template>

<script setup>
useHead({
    title: "HashFast",
});
</script>
