<template>
    <main class="bg-background min-h-dvh" v-if="user">
        <div class="fixed top-4 left-8 lg:hidden">
            <NuxtLink to="/">
                <IconLogo :width="20 * 1.55" :height="25 * 1.55" />
            </NuxtLink>
        </div>

        <div class="fixed top-6 right-8 lg:hidden z-20" @click="showMobileNav = !showMobileNav">
            <Hamburger :active="showMobileNav" />
        </div>
        <div class="grid lg:grid-cols-12 gap-x-5 lg:min-h-dvh pt-16 p-6 pb-0 lg:pt-6">
            <div class="lg:col-span-2 h-full">
                <MobileNav :active="showMobileNav" activeLink="transactions" :handleSignOut="signOut" />
            </div>
            <div
                class="lg:col-span-10 bg-dark rounded-3xl lg:rounded-bl-none lg:rounded-br-none h-full py-8 pb-48 lg:pt-20 px-6 lg:px-12 flex flex-col gap-10 animate-slide-up"
            >
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-semibold">Transactions</h1>

                    <AccountButton :userInitial="user.email?.charAt(0)" />
                </div>
                <div class="flex flex-wrap 2xl:flex-nowrap w-full gap-10 lg:flex-row-reverse xl:w-2/3">
                    <div class="w-full lg:w-auto">
                        <div class="lg:sticky lg:top-6 w-full">
                            <CardSummary
                                :numTransactions="filteredTransactions.length"
                                :sumAmount="sumAmount"
                                :currency="currency"
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-10 w-full grow">
                        <div class="flex gap-5 w-full">
                            <form class="grow">
                                <input
                                    v-model="searchText"
                                    type="text"
                                    placeholder="Search ..."
                                    class="bg-background! grow"
                                />
                            </form>
                            <!-- <NuxtLink to="/create" class="btn h-[47px]!">New link</NuxtLink> -->
                        </div>

                        <ul class="flex gap-10 text-lg font-medium">
                            <li
                                @click="currency = 'hbar'"
                                class="opacity-60 cursor-pointer hover:opacity-100 transition-opacity duration-300"
                                :class="{
                                    'opacity-100': currency === 'hbar',
                                }"
                            >
                                HBAR
                            </li>
                            <li
                                @click="currency = 'usdc'"
                                class="opacity-60 cursor-pointer hover:opacity-100 transition-opacity duration-300"
                                :class="{
                                    'opacity-100': currency === 'usdc',
                                }"
                            >
                                USDC
                            </li>
                        </ul>

                        <div class="flex flex-col gap-4 w-full">
                            <TransitionGroup name="list">
                                <CardTransaction
                                    v-for="(transaction, index) in filteredTransactions"
                                    :key="transaction.transactionId"
                                    :lastLogin="user.lastLogin"
                                    :transactionId="transaction.transactionId"
                                    :name="transaction.link.name"
                                    :amount="transaction.link.amount"
                                    :currency="transaction.link.currency"
                                    :createdAt="transaction.createdAt"
                                    :userId="user.id"
                                    :handleAddContact="handleAddContact"
                                />
                            </TransitionGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalAddressBook
            class="opacity-0 invisible duration-300 ease-in-out"
            :accountId="clickedAccountId"
            :handleToggle="() => (showContactModal = !showContactModal)"
            :userId="user.id"
            :class="{
                'opacity-100 visible': showContactModal,
            }"
        />
    </main>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

// const user = null;
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const showMobileNav = ref(false);
const currency = ref('hbar');
const searchText = ref(null);
const payments = ref([]);
const showContactModal = ref(false);
const clickedAccountId = ref('');

const sumAmount = computed(() => {
    return filteredTransactions.value.reduce((total, payment) => {
        return total + +payment.link.amount;
    }, 0);
});

// get all transactions
if (user.value) {
    try {
        payments.value = await $fetch('/api/payments', {
            query: { userId: user.value.id }, // filtered
        });
    } catch (error) {
        console.error('Failed to fetch payments:', error);
    }
}

const filteredTransactions = computed(() => {
    const term = searchText.value?.toLowerCase() || '';
    const selectedCurrency = currency.value;

    return payments.value.filter((payment) => {
        const matchesSearch =
            !term ||
            (payment.link.name && payment.link.name.toLowerCase().includes(term)) ||
            payment.transactionId.includes(term);

        const matchesCurrency = !selectedCurrency || payment.link.currency === selectedCurrency;

        return matchesSearch && matchesCurrency;
    });
});

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error('Failed to sign out:', err);
    }
};

const handleAddContact = (id) => {
    showContactModal.value = true;
    clickedAccountId.value = id;
};

useHead({
    title: 'Transactions | HashFast',
});
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.2s linear;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}
</style>
