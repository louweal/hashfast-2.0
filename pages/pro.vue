<template>
    <main>
        <Header />

        <Hero
            title="Unlock more features"
            description="Create fully customized payment requests and track every single payment from one powerful dashboard. More features. More clarity. More confidence."
            :links="[{ title: 'Pro Features', url: '#features' }]"
        />

        <section class="py-20">
            <div class="container flex flex-col gap-12 items-center justify-center">
                <div class="flex flex-col gap-5 items-center justify-center lg:w-1/2">
                    <h2 class="text-4xl font-semibold" id="features">Features</h2>

                    <p class="text-center text-xl">
                        Add details, set deadlines, customize your look — and manage all payments from a powerful
                        dashboard. Additional features will be added in the near future.
                    </p>
                </div>

                <div class="grid lg:grid-cols-12 gap-5">
                    <div class="lg:col-span-9">
                        <img src="/images/features-visual.png" alt="features" />
                    </div>

                    <div class="lg:col-span-3 animate-slide-up">
                        <div class="sticky flex flex-col gap-8 top-20 items-start">
                            <div class="flex flex-col gap-1">
                                <div class="flex gap-2">
                                    <IconList class="mt-2" />
                                    <h3 class="font-semibold text-xl">Advanced Payment Requests</h3>
                                </div>
                                <p class="text-base">
                                    Add descriptions, expiration dates, memos, and custom logos to make every request
                                    polished and professional.
                                </p>
                            </div>

                            <div class="flex flex-col gap-1">
                                <div class="flex gap-2">
                                    <IconPalette class="mt-0" />
                                    <h3 class="font-semibold text-xl">Branded Experience</h3>
                                </div>
                                <p class="text-base">
                                    Personalize your requests with your own logo and details, giving them a consistent,
                                    trustworthy look.
                                </p>
                            </div>

                            <div class="flex flex-col gap-1">
                                <div class="flex gap-2">
                                    <IconDashboard class="mt-1" />
                                    <h3 class="font-semibold text-xl">All-in-One Dashboard</h3>
                                </div>
                                <p class="text-base">
                                    Track all your sent requests and incoming payments in one organized, easy-to-use
                                    dashboard.
                                </p>
                            </div>

                            <NuxtLink to="/register" class="btn">Get started</NuxtLink>
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
                        Our pricing is simple: Each HashFast Pro transaction has a fixed fee of
                        <span class="font-medium text-base">$0.01</span>. For HBAR transactions the fee is the
                        equivalent of <span class="font-medium text-base">$0.01</span> in HBAR at the time of the
                        transaction as reported by
                        <a
                            class="opacity-75 duration-300 hover:opacity-100"
                            target="_blank"
                            href="https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd"
                            >CoinGecko</a
                        >.
                    </p>
                </div>
                <NuxtLink to="/register" class="btn">Sign up now</NuxtLink>
            </div>
        </section>

        <section class="py-20">
            <div class="container flex flex-col gap-12">
                <h2 class="text-4xl font-semibold text-center" id="features">Testimonials</h2>

                <div class="grid lg:grid-cols-12 gap-5">
                    <div class="lg:col-span-8 lg:col-start-3">
                        <div class="grid lg:grid-cols-2 gap-5">
                            <div class="flex flex-col gap-5">
                                <Testimonial
                                    name="John Doe"
                                    text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, aut explicabo. Consequuntur, quaerat itaque."
                                />
                                <Testimonial
                                    name="John Doe"
                                    text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, aut explicabo. Consequuntur, quaerat itaque."
                                />
                            </div>
                            <div class="flex flex-col gap-5">
                                <Testimonial
                                    name="John Doe"
                                    text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, aut explicabo. Consequuntur, quaerat itaque. Quia, aut explicabo. Consequuntur, quaerat itaque."
                                />
                                <Testimonial
                                    name="John Doe"
                                    text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, aut explicabo. Consequuntur, quaerat itaque."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <CTA
            title="Not convinced yet?"
            description="No worries, your can always use our free service. Create your first payment request now!"
            :links="[{ title: 'Create new link', url: '/create' }]"
            image="/images/create-free.png"
        />

        <Footer />
    </main>
</template>

<script setup>
useHead({
    title: 'HashFast Pro',
});
</script>
