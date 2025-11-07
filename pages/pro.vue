<template>
    <main>
        <Header />

        <Hero
            title="Discover what HashFast Pro has to offer"
            description="Create custom payment pages for accepting payments in HBAR and/or USDC."
            :links="[
                { title: 'Get started', url: '/register' },
                { title: 'Learn more', url: '#features' },
            ]"
        />

        <Footer />
    </main>
</template>

<script setup>
useHead({
    title: "HashFast Pro",
});
</script>
