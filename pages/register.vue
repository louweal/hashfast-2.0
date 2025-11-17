<template>
    <main class="min-h-dvh flex justify-center items-center">
        <div class="container flex flex-col justify-center items-center gap-6">
            <h1 class="text-4xl font-semibold">Register</h1>
            <div class="animate-slide-up bg-background p-8 rounded-lg border border-border w-full xs:w-[300px]">
                <div class="flex flex-col gap-4" v-if="showCreateForm">
                    <form @submit.prevent="createUser" class="space-y-4">
                        <div class="flex flex-col">
                            <label for="email">Email</label>
                            <input v-model="newUser.email" type="email" id="email" required />
                        </div>
                        <div class="flex flex-col">
                            <label for="password">Password</label>
                            <div class="flex flex-col gap-1">
                                <input
                                    v-model="newUser.password"
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    required
                                />
                                <input
                                    v-model="newUser.password2"
                                    type="password"
                                    id="password2"
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>
                        </div>
                        <div v-if="error" class="text-error mt-2">{{ error }}</div>
                        <div class="flex gap-4">
                            <button type="submit" :disabled="creating" class="btn w-full">
                                {{ creating ? 'Processing...' : 'Register' }}
                            </button>
                        </div>
                    </form>
                </div>
                <div v-else-if="showDetailsForm">
                    <h2 class="text-lg font-medium text-body">Enter your details</h2>

                    <form @submit.prevent="updateUser" class="space-y-4">
                        <!-- <div class="flex flex-col gap-2">
                            <label for="email" class="block text-body">Name</label>
                            <input v-model="user.name" type="text" id="name" required class="" />
                        </div> -->
                        <div class="flex flex-col gap-2">
                            <label for="password" class="block text-body">Hedera Account ID</label>
                            <div class="relative">
                                <input
                                    v-model="user.wallet"
                                    type="text"
                                    id="wallet"
                                    class="grow"
                                    placeholder="Type or click 'Detect'"
                                    :class="{
                                        'border-secondary!': user.wallet === detectedWallet,
                                    }"
                                    required
                                />
                                <div
                                    class="absolute top-2 right-2 btn btn--transparent btn--small"
                                    :class="{
                                        'is-active': user.wallet !== detectedWallet,
                                    }"
                                    @click="detectWallet"
                                >
                                    Detect
                                </div>
                            </div>
                            <p v-if="user.wallet === detectedWallet" class="text-secondary font-medium">
                                Successfully detected wallet
                            </p>
                        </div>
                        <div v-if="error" class="text-error mt-2">{{ error }}</div>
                        <div class="flex gap-4">
                            <button type="submit" :disabled="creating" class="btn">
                                {{ creating ? 'Processing...' : 'Save' }}
                            </button>
                        </div>
                    </form>
                </div>
                <div v-else class="flex flex-col gap-4">
                    <h2 class="text-lg font-medium text-body">Registration successful!</h2>
                    <p class="text-body">You can now log in with your email and password.</p>

                    <NuxtLink to="/login" class="btn self-start">Login</NuxtLink>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { HederaService } from '~/lib/hedera';

const hederaService = new HederaService();

const showCreateForm = ref(true);
const showDetailsForm = ref(false);
const creating = ref(false);
const newUser = ref({
    email: '',
    password: '',
    password2: '',
});

let userId = null;

const user = ref({
    // name: '',
    wallet: '',
});

let error = ref(null);
const detectedWallet = ref(null);

const detectWallet = async (event) => {
    event.preventDefault();
    try {
        await hederaService.initDAppConnector();
        await hederaService.openModal();

        // get hederaAccountId from localstorage
        const hederaAccountId = localStorage.getItem('hederaAccountId');

        if (hederaAccountId) {
            detectedWallet.value = hederaAccountId;
            user.value.wallet = detectedWallet.value;
        }
    } catch (error) {
        console.error('Failed to detect wallet:', error);
    }
};

const createUser = async () => {
    creating.value = true;
    try {
        // check password and password2 match
        if (newUser.value.password !== newUser.value.password2) {
            error.value = 'Passwords do not match';
            throw new Error('Passwords do not match');
        }

        try {
            const response = await $fetch('/api/users', {
                method: 'POST',
                body: newUser.value,
            });

            userId = response.id;

            // Reset form and refresh data
            newUser.value = { email: '', password: '', password2: '' };
            error.value = null;
            showCreateForm.value = false;
            showDetailsForm.value = true;
        } catch (error) {
            console.error('Failed to create user:', error);
        }
    } catch (error) {
        console.error('Failed to create user:', error);
    } finally {
        creating.value = false;
    }
};

const updateUser = async () => {
    creating.value = true;
    try {
        if (!user.value.wallet.startsWith('0.0.')) {
            error.value = 'Invalid Hedera Wallet ID';
            throw new Error('Invalid Hedera Wallet ID');
        }

        await $fetch('/api/users/' + userId, {
            method: 'PATCH',
            body: user.value,
        });
        showDetailsForm.value = false;
    } catch (error) {
        console.error('Failed to update user:', error);
    } finally {
        creating.value = false;
    }
};

useHead({
    title: 'Register - HashFast',
});
</script>
