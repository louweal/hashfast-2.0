<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-12 border border-border rounded-lg p-8 bg-background">
        <div class="flex gap-16">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                    <label for="wallet" class="text-sm text-body/50"
                        >Your wallet address<span class="required">*</span></label
                    >
                    <div class="relative">
                        <input type="text" id="wallet" class="input" placeholder="0.0.123" />
                        <div class="absolute top-2 right-2 btn btn--small">Detect</div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <label for="wallet" class="text-sm text-body/50">Amount</label>
                    <div class="relative">
                        <input type="text" id="wallet" class="input" placeholder="33" />
                        <div class="absolute top-2 right-2">
                            <div class="flex gap-1">
                                <span class="btn btn--small is-active">HBAR</span>
                                <span class="btn btn--small">USDC</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="preview">
                <div class="preview__bg"></div>

                <div class="flex flex-col gap-9 p-6 relative z-2">
                    <div class="flex justify-between gap-4">
                        <IconLogo />

                        <IconQR />
                    </div>

                    <div class="flex flex-col gap-5">
                        <div class="flex w-full justify-between">
                            <span>Amount</span>
                            <span class="text-wide">0.00</span>
                        </div>
                        <button class="btn">Pay now</button>
                    </div>
                </div>
            </div>
        </div>

        <button class="btn">Create Payment Request Link</button>
    </form>
</template>

<script setup>
const handleSubmit = () => {};
</script>

<style scoped>
.preview {
    position: relative;
    width: 280px;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid var(--color-border) !important;

    .preview__bg {
        position: absolute;
        inset: 0;
        background-image: url("/images/card-bg.png");
        background-repeat: no-repeat;
        background-size: cover;
        filter: blur(49px);
        animation: move 60s cubic-bezier(0.2, 0, 0.2, 1) infinite;
    }
}

@keyframes move {
    to {
        transform: rotate(360deg);
    }
}
</style>
