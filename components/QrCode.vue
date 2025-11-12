<template>
    <canvas ref="canvasRef" />
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import QRCode from 'qrcode';

const props = defineProps({
    url: {
        type: String,
        required: false,
    },
});

const emit = defineEmits(['change']);

const canvasRef = ref(null);

const generateQRCode = async () => {
    let url = props.url ? props.url : window.location.href;

    if (canvasRef.value) {
        try {
            await QRCode.toCanvas(canvasRef.value, url, { errorCorrectionLevel: 'L', width: 232 });
            const dataUrl = canvasRef.value.toDataURL();
            emit('change', dataUrl);
        } catch (err) {
            console.error('QR code generation failed', err);
        }
    }
};

onMounted(generateQRCode);

watch(() => props.value, generateQRCode);
</script>

<style scoped></style>
