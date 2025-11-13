<template>
    <main>
        <Header />

        <Hero
            title="Discover the possibilities of HashFast Pro"
            description="HashFast Pro makes your and the lifes of anyone around you a little easier by allowing you to create customized payment pages for all transactions on Hedera."
            :links="[{ title: 'Learn more', url: '#features' }]"
        />

        <section class="py-20">
            <div class="container flex flex-col gap-12 items-center justify-center">
                <div class="flex flex-col gap-5 items-center justify-center lg:w-1/2">
                    <h2 class="text-4xl font-semibold" id="features">Features</h2>

                    <p class="text-center text-xl">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem delectus iusto deserunt, odit
                        nulla molestiae fugiat vitae aut autem ullam animi accusantium laudantium, aliquid dignissimos
                        labore magnam veritatis?
                    </p>
                </div>

                <div class="grid lg:grid-cols-12 gap-5">
                    <div class="lg:col-span-9">
                        <img src="/images/features-visual-placeholder.png" alt="features" />
                    </div>

                    <div class="lg:col-span-3 animate-slide-up">
                        <div class="sticky flex flex-col gap-7 top-20">
                            <div class="flex flex-col gap-1">
                                <div class="flex gap-2 items-center">
                                    <IconLogo />
                                    <h3 class="font-semibold text-lg">Customize payment pages</h3>
                                </div>
                                <p class="text-base">
                                    Add custom text and images to your payment page. Set an expiration date, and much
                                    more.
                                </p>
                            </div>

                            <div class="flex flex-col gap-1">
                                <div class="flex gap-2 items-center">
                                    <IconLogo />
                                    <h3 class="font-semibold text-lg">Dashboard</h3>
                                </div>
                                <p class="text-base">Manage your payment links: create, update, and delete.</p>
                            </div>

                            <div class="flex flex-col gap-1">
                                <div class="flex gap-2 items-center">
                                    <IconLogo />
                                    <h3 class="font-semibold text-lg">Feature 3</h3>
                                </div>
                                <p class="text-base">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, aut explicabo.
                                    Consequuntur, quaerat itaque.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20">
            <div class="container flex flex-col gap-12 items-center justify-center">
                <div class="flex flex-col gap-5 items-center justify-center lg:w-1/2">
                    <h2 class="text-4xl font-semibold" id="features">Pricing</h2>

                    <p class="text-center text-xl">
                        Lorem ipsum dolor sit, amet consectetur elit. Quidem delectus iusto deserunt, odit nulla ipsa
                        molestiae fugiat vitae aut autem ullam animi accusantium laudantium, recusandae aliquid
                        dignissimos labore magnam veritatis?
                    </p>
                </div>
                <NuxtLink to="/register" class="btn">Get started</NuxtLink>
            </div>
        </section>

        <section class="py-20">
            <div class="container flex flex-col gap-12">
                <h2 class="text-4xl font-semibold text-center" id="features">Testimonials</h2>

                <div class="grid lg:grid-cols-12 gap-5 border">
                    <div class="lg:col-span-8 lg:col-start-3 border">todo</div>
                </div>
            </div>
        </section>

        <CTA />

        <Footer />
    </main>
</template>

<script setup>
useHead({
    title: 'HashFast Pro',
});
</script>
