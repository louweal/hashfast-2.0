<template>
    <div class="fixed inset-0 flex justify-center items-center">
        <div class="absolute inset-0 bg-dark/80 cursor-pointer" @click="handleToggle()"></div>

        <div
            class="w-full xs:w-[300px] bg-background rounded-lg border border-border p-6 z-2 relative flex flex-col gap-1"
        >
            <div class="absolute top-4 right-4 cursor-pointer" @click="handleToggle()"><IconCross /></div>
            <div class="text-heading">
                <span class="opacity-50">{{ !contact ? 'Add' : 'Update' }} name for {{ accountId }}:</span>
                <!-- <a class="opacity-80 font-medium" :href="`https://www.hashscan.io/${network}/account/${accountId}`">{{
                    accountId
                }}</a> -->
            </div>
            <form class="flex flex-col gap-3">
                <input type="text" id="name" name="name" v-model="newName" placeholder="Name" />
                <div class="btn" @click="!contact ? handleCreate() : handleUpdate()">
                    {{ !contact ? 'Add' : 'Update' }}
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const config = useRuntimeConfig();
const network = config.public.hederaNetwork;

const props = defineProps({
    accountId: {
        type: String,
        required: true,
    },
    handleToggle: {
        type: Function,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

const {
    data: contact,
    refresh,
    pending,
    error,
} = await useAsyncData('name', () => $fetch(`/api/contacts/${props.accountId}`), {
    watch: [() => props.accountId],
    immediate: false, // Don’t fetch until accountId is available
});

const newName = ref('');

// Initialize once when contact loads
watchEffect(() => {
    if (contact.value && !newName.value) newName.value = contact.value.name ?? '';
});

const handleCreate = async () => {
    if (newName.value === '') {
        return;
    }

    try {
        const response = await $fetch('/api/contacts', {
            method: 'POST',
            body: {
                accountId: props.accountId,
                name: newName.value,
                userId: props.userId,
            },
        });

        location.reload();
    } catch (error) {
        console.error('Failed to create contact:', error);
    }
};

const handleUpdate = async () => {
    if (newName.value === '') {
        return;
    }

    try {
        const response = await $fetch(`/api/contacts/${props.accountId}`, {
            method: 'PATCH',
            body: {
                name: newName.value,
            },
        });
        location.reload();
    } catch (error) {
        console.error('Failed to update contact:', error);
    }
};
</script>
