<template>
    <div class="header fixed top-0 left-0 right-0 py-4 px-5 z-3">
        <div class="flex justify-between items-center">
            <Logo :homeUrl="user ? '/dashboard/links' : '/'" />

            <nav>
                <ul v-if="!user" class="flex gap-7 items-center">
                    <li>
                        <NuxtLink to="/login" class="btn btn--dark">Login</NuxtLink>
                    </li>
                </ul>
                <ul v-else class="flex gap-7 items-center">
                    <li class="hidden md:block">
                        <NuxtLink to="/dashboard/links" class="text-base font-medium">Dashboard</NuxtLink>
                    </li>
                    <li>
                        <button class="btn btn--dark" @click="signOut">Sign out</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
// import { HashConnectConnectionState } from "hashconnect";
import { HederaService } from '~/lib/hedera';
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const hederaService = new HederaService();
const state = hederaService.state;

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error('Failed to sign out:', err);
    }
};
</script>

<style scoped>
.header {
    height: var(--header-height);
}
</style>
