<template>
    <main>
        <Header :gradient="true" />
        <div class="container flex flex-col justify-center items-center gap-4 pt-40">
            <h1 class="text-6xl font-bold">{{ error.statusCode || 500 }}</h1>
            <p class="mt-4 text-lg text-error">
                {{ error.statusMessage || 'An unexpected error occurred.' }}
            </p>
            <NuxtLink to="/" class="btn"><IconArrowLeft class="mr-2" />Back to Homepage</NuxtLink>
        </div>
    </main>
</template>

<script setup>
const error = useError();
</script>
