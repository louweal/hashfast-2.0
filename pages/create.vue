<template>
    <main>
        <Header />
        <div class="container py-32 lg:pb-0 h-full flex flex-col justify-center items-center gap-10 animate-slide-up">
            <div class="flex flex-col gap-4">
                <NuxtLink
                    to="/dashboard/links"
                    class="flex gap-2.5 items-center self-start font-medium leading-none"
                    v-if="user"
                >
                    <IconArrowLeft :scale="0.75" />
                    <span>Back</span>
                </NuxtLink>
                <FormCreate
                    :pro="user ? true : false"
                    :userId="user ? user.id : null"
                    :accountId="user ? user.wallet : null"
                    :email="user ? user.email : null"
                    :image="user ? user.image : null"
                />
            </div>

            <div class="flex flex-col gap-10" v-if="!user">
                <p class="text-[22px]">More features are waiting for you.</p>

                <NuxtLink to="/pro" class="btn">Discover Pro</NuxtLink>
            </div>
        </div>
    </main>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

useHead({
    title: 'Create link | HashFast',
});
</script>
