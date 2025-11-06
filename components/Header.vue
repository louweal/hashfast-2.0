<template>
    <div class="header fixed top-0 left-0 right-0 z-50 py-4 px-5">
        <div class="flex justify-between items-center">
            <Logo :homeUrl="user ? '/dashboard' : '/'" />

            <nav>
                <ul v-if="!user" class="flex gap-7 items-center text-white">
                    <li>
                        <NuxtLink to="/login" class="btn btn--dark">Login</NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
// import { HashConnectConnectionState } from "hashconnect";
import { HederaService } from "~/lib/hedera";
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const hederaService = new HederaService();
const state = hederaService.state;

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error("Failed to sign out:", err);
    }
};
</script>

<style scoped>
.header {
    height: var(--header-height);
}
</style>
