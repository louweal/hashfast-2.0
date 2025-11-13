<template>
    <main class="min-h-dvh flex justify-center items-center">
        <div class="flex flex-col justify-center items-center gap-4">
            <client-only>
                <NuxtLink
                    v-if="previousUrl"
                    :to="previousUrl"
                    class="flex gap-2.5 items-center self-start font-medium leading-none"
                >
                    <IconArrowLeft :scale="0.75" />
                    <span>Back</span>
                </NuxtLink>
            </client-only>
            <div class="animate-slide-up bg-background p-8 rounded-lg border border-border w-full xs:w-[300px]">
                <!-- <h2 class="text-3xl font-semibold">Account</h2> -->

                <form @submit.prevent="updateUser" class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label for="password" class="block text-body">Hedera Account ID ({{ network }})</label>
                        <div class="relative">
                            <input
                                v-model="user.wallet"
                                type="text"
                                id="wallet"
                                class="grow"
                                placeholder="Type or click 'Detect'"
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
                    <!-- <div class="flex flex-col gap-1">
                        <label for="email" class="block text-body">Your name</label>
                        <input v-model="user.name" type="text" id="name" required class="" />
                    </div> -->
                    <div class="flex flex-col gap-1">
                        <label for="email" class="block text-body">Image</label>
                        <div @click="triggerFileInput">
                            <div>
                                <img
                                    v-if="imageUrl"
                                    class=""
                                    :src="imageUrl"
                                    width="50"
                                    height="50"
                                    title="Upload icon"
                                />
                                <div v-else class="cursor-pointer py-3">
                                    <div v-if="user.image"><img class="" :src="user.image" height="20" /></div>
                                    <IconLogo v-else />
                                </div>
                            </div>

                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/*"
                                @change="handleFileChange"
                                class="hidden"
                            />
                        </div>
                    </div>
                    <div v-if="error" class="text-error mt-2">{{ error }}</div>
                    <div class="flex gap-4">
                        <button type="submit" :disabled="creating" class="btn w-full">
                            {{ creating ? 'Processing...' : 'Update' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>
import { HederaService } from '~/lib/hedera';
import { useRouter } from 'vue-router';

const hederaService = new HederaService();
const showDetailsForm = ref(true);
const creating = ref(false);

const config = useRuntimeConfig();
const network = ref(config.public.hederaNetwork || 'testnet');

const detectedWallet = ref(null);
const fileInput = ref(null);
const imageFile = ref(null);

// get previous url (history 1 back)
const router = useRouter();

// get previous url
const previousUrl = router.options.history.state.back;

// fetch user data
const { user, loading, error: userError, isLoggedIn, fetchUser } = useAuth();
await fetchUser();

let error = ref(null);
const imageUrl = ref(user.image);

const detectWallet = async (event) => {
    event.preventDefault();
    try {
        await hederaService.initHashConnect();
        await hederaService.waitForPairing();

        if (hederaService.pairingData) {
            // get last item in array
            user.value.wallet = hederaService.pairingData.accountIds[hederaService.pairingData.accountIds.length - 1];
            detectedWallet.value = user.value.wallet;
        }
    } catch (error) {
        console.error('Failed to detect wallet:', error);
    }
};

const updateUser = async () => {
    creating.value = true;
    try {
        if (!user.value.wallet.startsWith('0.0.')) {
            error.value = 'Invalid Hedera Wallet ID';
            throw new Error('Invalid Hedera Wallet ID');
        }

        await $fetch('/api/users/' + user.value.id, {
            method: 'PATCH',
            body: user.value,
        });
        showDetailsForm.value = false;
        navigateTo('/dashboard/links');
    } catch (error) {
        console.error('Failed to update user:', error);
    } finally {
        creating.value = false;
    }
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    } else {
        console.warn('fileInput ref is not set yet');
    }
};

const handleFileChange = async (event) => {
    if (!event.target.files[0]) return;

    if (event.target.files[0].size > 1024 * 40) {
        alert('Image size must be less than 40KB');
        return;
    }

    imageFile.value = event.target.files[0];

    if (imageFile.value) {
        user.value.image = await imageFileToBase64(imageFile.value);
    }
};

const imageFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

useHead({
    title: 'Account | HashFast',
});
</script>
