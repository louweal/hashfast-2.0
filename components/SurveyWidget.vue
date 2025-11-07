<template>
    <div class="fixed bottom-8 left-8">
        <div
            class="absolute left-0 bottom-0 flex gap-6 flex-col border border-border rounded-lg bg-background p-5 w-xs transition-opacity duration-300 ease-in-out"
            :class="{
                'opacity-0 invisible': !isOpen,
            }"
        >
            <div class="flex justify-between items-center gap-4">
                <div class="flex grow gap-2">
                    <div
                        v-if="curQuestion <= numQuestions"
                        class="flex flex-1 bg-[#9ca3af] h-[3px] rounded-sm"
                        :class="{
                            'bg-primary': i === curQuestion,
                        }"
                        v-for="i in numQuestions"
                    ></div>
                </div>

                <IconCross
                    class="cursor-pointer scale-125"
                    @click="
                        isOpen = false;
                        curQuestion = 1;
                    "
                />
            </div>

            <form v-if="curQuestion === 1" class="flex flex-col gap-5">
                <h3 class="font-medium text-base">
                    How would you rate the overall user experience and user interface?
                </h3>
            </form>
            <form v-else-if="curQuestion === 2" class="flex flex-col gap-5">
                <h3 class="font-medium text-base">
                    Did you <strong>create</strong> a payment request link and how was your experience?
                </h3>

                <textarea rows="3" cols="20" @input="handleInput"
                    >{{ answers[curQuestion] ?? "Type your answer here" }}
                </textarea>
            </form>
            <form v-else-if="curQuestion === 3" class="flex flex-col gap-5">
                <h3 class="font-medium text-base">
                    Did you <strong>pay</strong> a payment request link and how was your experience?
                </h3>

                <textarea rows="3" cols="20" @input="handleInput">{{
                    answers[curQuestion] ?? "Type your answer here"
                }}</textarea>
            </form>
            <form v-else-if="curQuestion === 4" class="flex flex-col gap-5">
                <h3 class="font-medium text-base">
                    Did you create a Pro account? And do you like the features that Pro offers?
                </h3>

                <textarea rows="3" cols="20" @input="handleInput"
                    >{{ answers[curQuestion] ?? "Type your answer here" }}
                </textarea>
            </form>

            <form v-else-if="curQuestion === 5" class="flex flex-col gap-5">
                <h3 class="font-medium text-base">Please share any additional feedback</h3>

                <textarea rows="3" cols="20" @input="handleInput"
                    >{{ answers[curQuestion] ?? "Type your answer here" }}
                </textarea>
            </form>

            <form v-else-if="curQuestion === 6" class="flex flex-col gap-5">
                <p>Thank you for your feedback!</p>
                <input type="text" placeholder="Name" />

                <div class="flex gap-3 items-center">
                    <input type="checkbox" />
                    <span
                        >I give my consent to publish my feedback on the website
                        <span class="opacity-50">(optional)</span></span
                    >
                </div>
            </form>

            <div class="flex justify-end gap-2">
                <button class="btn btn--transparent" @click="curQuestion = curQuestion - 1" v-if="curQuestion > 1">
                    Previous
                </button>
                <button class="btn" @click="handleSubmit">
                    {{ curQuestion >= numQuestions ? "Submit" : "Next" }}
                </button>
            </div>
        </div>
        <div
            class="absolute left-0 bottom-0 transition-opacity duration-300"
            :class="{
                'opacity-0 invisible': isOpen,
            }"
        >
            <div class="btn" @click="isOpen = true">Share feedback</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const isOpen = ref(true);
const numQuestions = ref(5);
const curQuestion = ref(1);
const answers = ref({});

const handleSubmit = () => {
    curQuestion.value++;
    // todo store feedback in db
};

const handleInput = (e) => {
    answers.value[curQuestion.value] = e.target.value;
};
</script>
