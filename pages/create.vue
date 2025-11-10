<template>
    <main>
        <Header />
        <div class="container pt-32 h-full flex flex-col justify-center items-center gap-10 animate-slide-up">
            <div class="flex flex-col gap-4">
                <NuxtLink
                    to="/dashboard/links"
                    class="flex gap-2.5 items-center self-start font-medium leading-none"
                    v-if="user"
                >
                    <IconArrowLeft :scale="0.75" />
                    <span>Back</span>
                </NuxtLink>
                <FormCreate :pro="user ? true : false" :accountId="user ? user.wallet : null" />
            </div>

            <div class="flex flex-col gap-10" v-if="!user">
                <p class="text-[22px]">More features are waiting for you.</p>

                <NuxtLink to="/pro" class="btn">Discover HashFast Pro</NuxtLink>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
// const user = null;
const { user, loading, error, isLoggedIn, fetchUser, logout } = useAuth();
await fetchUser();

useHead({
    title: "Create link - HashFast",
});

const fileInput = ref(null);

let imageFile = ref(null); //file
const imageUrl = ref(null);
const showOptionalFields = ref(false);

// Generate object URL whenever file changes
watch(imageFile, (newFile) => {
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value); // clean up previous URL
    }
    imageUrl.value = newFile ? URL.createObjectURL(newFile) : null;
});

const toggleOptionalFields = () => {
    showOptionalFields.value = !showOptionalFields.value;
};

const imageFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    } else {
        console.warn("fileInput ref is not set yet");
    }
};

const handleFileChange = async (event) => {
    if (!event.target.files[0]) return;

    if (event.target.files[0].size > 1024 * 40) {
        alert("Image size must be less than 40KB");
        return;
    }

    imageFile.value = event.target.files[0];

    if (imageFile.value) {
        newLink.value.image = await imageFileToBase64(imageFile.value);
    }
};

const createLink = async () => {
    if (newLink.value.currency === "*" && newLink.value.amount) {
        alert("Please select a currency");
        return;
    }

    try {
        const expirationDate = newLink.value.expires ? new Date(newLink.value.expires) : null;
        newLink.value.amount = newLink.value.amount ? Number(newLink.value.amount) : null;
        newLink.value.maxPayments = newLink.value.maxPayments ? Number(newLink.value.maxPayments) : null;
        newLink.value.authorId = user.value.id;

        const bodyPayload = { ...newLink.value, expires: expirationDate };

        const response = await $fetch("/api/links", {
            method: "POST",
            body: bodyPayload,
        });

        // get ID
        const linkId = response.id;
        if (!linkId) {
            throw new Error("Failed to create link");
        }
        navigateTo("/link/share/" + linkId + "?new=true");
    } catch (error) {
        console.error("Failed to create link:", error);
    }
};
</script>
