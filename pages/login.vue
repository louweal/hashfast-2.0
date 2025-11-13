<template>
    <main class="min-h-dvh flex justify-center items-center">
        <div class="container flex flex-col justify-center items-center gap-6">
            <h1 class="text-4xl font-semibold">Sign in</h1>
            <div class="animate-slide-up bg-background p-8 rounded-lg border border-border w-full xs:w-[300px]">
                <div class="flex flex-col gap-4">
                    <form @submit.prevent="handleLogin" class="space-y-4">
                        <div class="flex flex-col">
                            <label for="email">Email</label>
                            <input v-model="email" type="email" id="email" required />
                        </div>
                        <div class="flex flex-col">
                            <label for="password">Password</label>
                            <input v-model="password" type="password" id="password" required />
                        </div>
                        <button type="submit" class="btn w-full">Sign in</button>
                        <p v-if="error" class="text-error">{{ error }}</p>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
    error.value = '';
    loading.value = true;

    try {
        const res = await $fetch('/api/auth/login', {
            method: 'POST',
            body: { email: email.value, password: password.value },
            credentials: 'include', // send cookies
        });

        await router.push('/dashboard/links');
    } catch (err) {
        error.value = err?.data?.message || 'Login failed';
    } finally {
        loading.value = false;
    }
};

useHead({
    title: 'Login - HashFast',
});
</script>
