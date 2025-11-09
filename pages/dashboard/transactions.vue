<template>
    <main class="bg-background min-h-dvh" v-if="user">
        <div class="fixed top-4 left-8 lg:hidden">
            <IconLogo :width="20 * 1.55" :height="25 * 1.55" />
        </div>

        <div class="fixed top-6 right-8 lg:hidden z-20" @click="showMobileNav = !showMobileNav">
            <Hamburger :active="showMobileNav" />
        </div>
        <div class="grid lg:grid-cols-12 gap-x-5 lg:min-h-dvh pt-16 p-6 pb-0 lg:pt-6">
            <div class="lg:col-span-2 lg:h-full">
                <MobileNav :active="showMobileNav" activeLink="transactions" :handleSignOut="signOut" />
            </div>
            <div
                class="lg:col-span-10 bg-dark rounded-3xl lg:rounded-bl-none lg:rounded-br-none h-full py-8 lg:pt-20 px-6 lg:px-12 flex flex-col gap-10"
            >
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-semibold">Transactions</h1>

                    <AccountButton :userInitial="user.name?.charAt(0)" />
                </div>
                <div class="flex flex-wrap lg:flex-nowrap w-full gap-10">
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
                    <CardSummary />
                </div>
            </div>
        </div>
    </main>
    <main v-else>
        <p>Something went wrong</p>
    </main>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

// const user = null;
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const showMobileNav = ref(false);

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error("Failed to sign out:", err);
    }
};

useHead({
    title: "Transactions | HashFast",
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
