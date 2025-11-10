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
                <MobileNav :active="showMobileNav" activeLink="links" :handleSignOut="signOut" />
            </div>
            <div
                class="lg:col-span-10 bg-dark rounded-3xl lg:rounded-bl-none lg:rounded-br-none h-full py-8 pb-48 lg:pt-20 px-6 lg:px-12 flex flex-col gap-10 animate-slide-up"
            >
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-semibold">Links</h1>

                    <AccountButton :userInitial="user.name?.charAt(0)" />
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
                        <NuxtLink to="/create" class="btn h-[47px]!">New link</NuxtLink>
                    </div>

                    <div class="grid lg:grid-cols-3 gap-20">
                        <div class="flex flex-col gap-12">
                            <h3 class="flex gap-1 items-center">
                                <span class="text-xl font-semibold">Waiting</span>
                                <Tooltip text="Waiting for payment"> <IconQuestion /></Tooltip>
                            </h3>

                            <div class="flex flex-col gap-8">
                                <TransitionGroup name="list">
                                    <CardLink v-for="link in waitingLinks" :key="link.id" v-bind="link" />
                                </TransitionGroup>
                            </div>
                        </div>
                        <div class="flex flex-col gap-12">
                            <h3 class="flex gap-1 items-center">
                                <span class="text-xl font-semibold">Active</span>
                                <!-- <Tooltip text="Waiting for payment"> <IconQuestion /></Tooltip> -->
                            </h3>

                            <div class="flex flex-col gap-8">
                                <TransitionGroup name="list">
                                    <CardLink v-for="link in activeLinks" :key="link.id" v-bind="link" />
                                </TransitionGroup>
                            </div>
                        </div>
                        <div class="flex flex-col gap-12">
                            <h3 class="flex gap-1 items-center">
                                <span class="text-xl font-semibold">Archive</span>
                                <Tooltip text="Deleted and expired links"> <IconQuestion /></Tooltip>
                            </h3>

                            <div class="flex flex-col gap-8">
                                <TransitionGroup name="list">
                                    <CardLink v-for="link in archivedLinks" :key="link.id" v-bind="link" />
                                </TransitionGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from "vue";
import Tooltip from "~/components/Tooltip.vue";
import { useAuth } from "~/composables/useAuth";

const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const showMobileNav = ref(false);
const searchText = ref(null);
const links = ref([]);

// get all transactions
if (user.value) {
    try {
        links.value = await $fetch("/api/links", {
            query: { userId: user.value.id }, // filtered
        });
    } catch (error) {
        console.error("Failed to fetch payments:", error);
    }
}

// filter links only those without payments
const waitingLinks = computed(() => {
    const term = searchText.value?.toLowerCase() || "";

    return links.value.filter((link) => {
        const matchesSearch =
            !term ||
            (link.name && link.name.toLowerCase().includes(term)) ||
            (link.memo && link.memo.toLowerCase().includes(term)) ||
            link.accountId.includes(term);

        const matchesCategory = (!link.payments || link.payments.length === 0) && !link.archived;

        return matchesSearch && matchesCategory;
    });
});

const activeLinks = computed(() => {
    const term = searchText.value?.toLowerCase() || "";

    return links.value.filter((link) => {
        const matchesSearch =
            !term ||
            (link.name && link.name.toLowerCase().includes(term)) ||
            (link.memo && link.memo.toLowerCase().includes(term)) ||
            link.accountId.includes(term);

        const matchesCategory = link.payments && link.payments.length > 0 && !link.archived;

        return matchesSearch && matchesCategory;
    });
});

const archivedLinks = computed(() => {
    const term = searchText.value?.toLowerCase() || "";

    return links.value.filter((link) => {
        const matchesSearch =
            !term ||
            (link.name && link.name.toLowerCase().includes(term)) ||
            (link.memo && link.memo.toLowerCase().includes(term)) ||
            link.accountId.includes(term);

        const matchesCategory = link.archived && link.archived == true;

        return matchesSearch && matchesCategory;
    });
});

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error("Failed to sign out:", err);
    }
};

useHead({
    title: "Payment Requests | HashFast",
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
