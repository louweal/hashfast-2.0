<template>
    <div class="fixed bottom-6 right-6 z-9">
        <div
            class="absolute right-0 bottom-0 flex gap-6 flex-col border border-border rounded-lg bg-background p-5 w-xs transition-opacity duration-300 ease-in-out"
            :class="{
                'opacity-0 invisible': !isOpen,
            }"
        >
            <div class="flex justify-between items-center gap-4">
                <div class="flex grow gap-2">
                    <div
                        class="flex flex-1 bg-[#9ca3af] h-[3px] rounded-sm transition-colors duration-300 ease-in-out"
                        :class="{
                            'bg-primary': i === curQuestion,
                        }"
                        v-for="i in numQuestions"
                    ></div>
                </div>

                <IconCross :size="15" class="cursor-pointer" @click="isOpen = false" />
            </div>

            <form v-if="curQuestion === 1" class="flex flex-col gap-5">
                <h3 class="text-base">How would you rate your overall experience?</h3>

                <client-only>
                    <div class="flex gap-2 justify-center items-center">
                        <RatingButton @click="answer1 = 1" :rating="1" :curRating="answer1">
                            <IconRatingVeryBad />
                        </RatingButton>
                        <RatingButton @click="answer1 = 2" :rating="2" :curRating="answer1">
                            <IconRatingBad />
                        </RatingButton>
                        <RatingButton @click="answer1 = 3" :rating="3" :curRating="answer1">
                            <IconRatingNeutral />
                        </RatingButton>
                        <RatingButton @click="answer1 = 4" :rating="4" :curRating="answer1">
                            <IconRatingHappy />
                        </RatingButton>
                        <RatingButton @click="answer1 = 5" :rating="5" :curRating="answer1">
                            <IconRatingVeryHappy />
                        </RatingButton>
                    </div>
                </client-only>
                <p>In the next questions you can share any suggestions for improvement.</p>
            </form>
            <form v-else-if="curQuestion === 2" class="flex flex-col gap-5">
                <h3 class="font-regular text-base">
                    Did you create a payment request link? What works well, and what challenges have you encountered?
                </h3>

                <textarea
                    id="answer2"
                    rows="3"
                    cols="20"
                    @input="handleInput"
                    placeholder="Type your answer here"
                    v-model="answer2"
                >
                </textarea>
            </form>
            <form v-else-if="curQuestion === 3" class="flex flex-col gap-5">
                <h3 class="text-base">
                    Did you pay a payment request? What works well, and what challenges have you encountered?
                </h3>

                <textarea
                    id="answer3"
                    rows="3"
                    cols="20"
                    @input="handleInput"
                    placeholder="Type your answer here"
                    v-model="answer3"
                ></textarea>
            </form>
            <form v-else-if="curQuestion === 4" class="flex flex-col gap-5">
                <h3 class="text-base">
                    Did you create a Pro account? Please describe what you like about Pro or what could be improved.
                </h3>

                <textarea
                    id="answer4"
                    rows="3"
                    cols="20"
                    @input="handleInput"
                    placeholder="Type your answer here"
                    v-model="answer4"
                >
                </textarea>
            </form>

            <form v-else-if="curQuestion === 5" class="flex flex-col gap-5">
                <h3 class="text-base leading-snug">
                    Do you have any other feedback, ideas, or suggestions to help us improve your experience?
                </h3>

                <textarea
                    id="answer5"
                    rows="3"
                    cols="20"
                    @input="handleInput"
                    placeholder="Type your answer here"
                ></textarea>
            </form>

            <div v-else>
                <p class="text-center text-lg">Thank you for your feedback!</p>
            </div>

            <!-- <form v-else-if="curQuestion === 6" class="flex flex-col gap-5">
                <p>Thank you for your feedback!</p>
                <input type="text" placeholder="Name" />

                <div class="flex gap-3 items-center">
                    <input type="checkbox" />
                    <span
                        >I give my consent to publish my feedback on the website
                        <span class="opacity-50">(optional)</span></span
                    >
                </div>
            </form> -->

            <div class="flex justify-end gap-2" v-if="curQuestion < numQuestions + 1">
                <button class="btn btn--transparent" @click="curQuestion = curQuestion - 1" v-if="curQuestion > 1">
                    Previous
                </button>
                <button class="btn" @click="curQuestion >= numQuestions ? handleSubmit() : handleNext()">
                    {{ curQuestion >= numQuestions ? 'Submit' : 'Next' }}
                </button>
            </div>
        </div>
        <div
            class="absolute right-0 bottom-0 transition-opacity duration-300"
            :class="{
                'opacity-0 invisible': isOpen,
            }"
        >
            <div class="btn btn--secondary" @click="isOpen = true">Share feedback</div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const numQuestions = ref(5);
const curQuestion = ref(1);
const answer1 = ref(0);
const answer2 = ref('');
const answer3 = ref('');
const answer4 = ref('');
const answer5 = ref('');
// const name = ref("");
// const consent = ref(false);

const handleNext = () => {
    curQuestion.value++;
};

const handleSubmit = async () => {
    curQuestion.value++;

    // store answers
    try {
        const response = await $fetch('/api/survey', {
            method: 'POST',
            body: {
                answer1: answer1.value.toString(),
                answer2: answer2.value,
                answer3: answer3.value,
                answer4: answer4.value,
                answer5: answer5.value,
                consent: false,
            },
        });
        if (!response.id) {
            throw new Error('Failed to create survey entry');
        }
    } catch (error) {
        console.error('Failed to create survey entry:', error);
    }
};

const handleInput = (e) => {
    switch (curQuestion.value) {
        case 1:
            answer1.value = e.target.value ? +e.target.value : null;
            break;
        case 2:
            answer2.value = e.target.value;
            break;
        case 3:
            answer3.value = e.target.value;
            break;
        case 4:
            answer4.value = e.target.value;
            break;
        case 5:
            answer5.value = e.target.value;
            break;
        default:
            break;
    }
};
</script>
