<template>
    <div class="fixed inset-0 bg-background p-6 flex flex-col gap-10 justify-between z-10 lg:relative h-full">
        <div class="flex flex-col gap-6">
            <div class="flex justify-between gap-4">
                <IconLogo :width="67" :height="55" />

                <div class="toggle">ttoo</div>
            </div>

            <ul>
                <li><NuxtLink to="/dashboard"> ico Links</NuxtLink></li>
                <li><NuxtLink to="/dashboard/links">ico Transactions</NuxtLink></li>
            </ul>
        </div>
        <div class="btn" @click="signOut">Sign out</div>
    </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

// const user = null;
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

const signOut = async () => {
    try {
        logout();
    } catch (err) {
        console.error("Failed to sign out:", err);
    }
};
</script>
