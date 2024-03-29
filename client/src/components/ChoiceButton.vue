<template>
    <button
        style="margin-bottom: 1.5rem"
        type="button"
        :id="card!._id"
        :value="`${text}`"
        class="button is-info"
        :class="{
            'is-tooltip': shouldBeTooltip,
            'is-second': order === 2,
            'is-fourth': order === 4,
            'is-correct': isCorrect === true,
            'is-incorrect': isCorrect === false,
        }"
        @click.prevent="
            (e: any) => {
                openAnswerInModalIfMobileScreenWidth(card!);

                if ((e.target.localName === 'button' || e.target.localName === 'p') && !new RegExp('choice', 'g').test(e.target.id)) {
                    (async () => {
                        await submitCardFlipCheck(e, true);
                    })();
                }
            }
        "
    >
        <p
            v-if="!isMobile && shouldBeTooltip"
            :id="choiceId"
            :class="{ tooltiptext: shouldBeTooltip }"
            @click.prevent="
                (e: any) => {
                    if (e.target.localName === 'p' && new RegExp('choice', 'g').test(e.target.id)) {
                        (async () => {
                            await submitCardFlipCheck(e, true);
                        })();
                    }
                }
            "
        >
            {{
                (async () => {
                    await insertLineBreaksInPTag(text as string);
                })()
            }}
        </p>
        <p :id="card!._id" :class="{ 'long-form': true }">
            {{ parseText(text as string) || "nothing yet" }}
        </p>
    </button>
</template>

<!-- huh... is this thing still connected? If so, hello.  -->
<!-- hey it's late go to bed! -->
<!-- shoot, I should probably close the live-share session after I'm done huh lol -->
<script lang="ts">
import {
    CardClass,
    ModalTitle,
    MyRootState,
    Nullable,
    RootCommitType,
    RootDispatchType,
    OpenModalPayload,
    Card,
    MyGetters,
    MyCustomEvent,
} from "@/types";
import { computed } from "@vue/reactivity";
import { defineComponent, ref, PropType } from "@vue/runtime-core";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
export default defineComponent({
    name: "ChoiceButton.vue",
    props: {
        order: Number,
        card: Object as PropType<Card>,
        choiceId: String,
        text: String,
    },
    setup() {
        const isCorrect = ref();
        const toast = useToast();
        const guessesCounter = computed<number>(() => {
            return store.state.user.user.answers.guesses;
        });
        const store = useStore<MyRootState>();
        const allCards = computed<Card[]>(() => {
            return store.state.cards.allCards;
        });
        const example = ref<string>("works");
        const shouldBeTooltip = ref<boolean>(false);
        const isMobile = computed<boolean>(
            () => store.getters["mobile/isMobile" as MyGetters]
        );
        return {
            toast,
            example,
            guessesCounter,
            store,
            isCorrect,
            shouldBeTooltip,
            isMobile,
            allCards,
        };
    },
    methods: {
        async insertLineBreaksInPTag(input: string): Promise<void> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const limit = 5;
                    const words = input.split(" ");

                    if (words.length >= limit) {
                        for (let i = 0; i < words.length; i++) {
                            if (i !== 0 && i % 5 === 0) {
                                words[i] = words[i] + " <br>";
                            }
                        }
                        const toolTipEl = document.getElementById(
                            this.choiceId as string
                        );
                        // guard against runtime exceptions
                        // insert the innerHTML with the line breaks to actually render with line breaks
                        if (toolTipEl) {
                            toolTipEl.innerHTML = words.join(" ");
                        }
                        resolve();
                    } else {
                        const toolTipEl = document.getElementById(
                            this.choiceId as string
                        );
                        // guard against runtime exceptions
                        // insert the innerHTML with the line breaks to actually render with line breaks
                        if (toolTipEl) {
                            toolTipEl.innerHTML = words.join(" ");
                        }
                        resolve();
                    }
                }, 300);
            });
        },
        parseText(input: string): string {
            if (input === "") return "";
            let new_str = input;
            const new_str_split_length = new_str.split("").length;
            const limit = 9;

            if (new_str_split_length >= limit) {
                this.shouldBeTooltip = true;
                new_str = new_str
                    .split("")
                    .map((char, i) => {
                        if (i === limit) {
                            return "...";
                        }
                        if (i < limit) {
                            return char;
                        }
                    })
                    .join("");
                return new_str;
            } else {
                this.shouldBeTooltip = false;
                return input;
            }
        },
        async submitCardFlipCheck(
            event: MyCustomEvent,
            _isFrontSide: boolean
        ): Promise<void> {
            this.store.commit(
                "user/INCREMENT_GUESS_COUNTER" as RootCommitType,
                null,
                { root: true }
            );
            let text =
                event.target.localName === "p"
                    ? event.target.textContent
                    : event.target.value;

            if (this.shouldBeTooltip)
                text = this.allCards.find((card) => this.card?._id === card._id)
                    ?.backSideText as string;

            if (_isFrontSide) {
                if (text === this.card?.backSideText) {
                    this.isCorrect = true;
                    // increment correct score
                    this.store.commit(
                        "user/INCREMENT_CORRECT" as RootCommitType,
                        null,
                        { root: true }
                    );
                    // TODO: display message on card that it was right
                    // increment the user's score when right
                    // after some time flip the card back to the front and go to the next card in the CardList being displayed
                    this.toast.success("Correct!", { timeout: 500 });
                    setTimeout(async () => {
                        this.store.commit(
                            "user/RESET_GUESS_COUNTER" as RootCommitType,
                            null,
                            { root: true }
                        );
                        await this.shiftCardNext(null, this.card?._id);
                    }, 1000);
                } else {
                    this.isCorrect = false;
                    // increment incorrect score
                    this.store.commit(
                        "user/INCREMENT_INCORRECT" as RootCommitType,
                        null,
                        { root: true }
                    );
                    if (this.guessesCounter === 3) {
                        // TODO display message on card that it was wrong
                        // on the backside,
                        this.store.commit(
                            "cards/TOGGLE_CARD_SIDE" as RootCommitType,
                            this.card?._id,
                            { root: true }
                        );
                        this.toast.error(
                            "Oops! that was the wrong answer :( \n check the answer and try again!",
                            {
                                timeout: 3000,
                            }
                        );
                        setTimeout(async () => {
                            this.store.commit(
                                "user/RESET_GUESS_COUNTER" as RootCommitType,
                                null,
                                { root: true }
                            );
                            await this.shiftCardNext(null, this.card?._id);
                        }, 3500);
                    }
                    // after some time shift to the next card
                }
                //set the class on for the flip animation on the card object itself.
            } else {
                //is backside, just flip without checking translation
                // this.store.commit(
                //     "cards/TOGGLE_CARD_SIDE" as RootCommitType, id, { root: true }
                // );
                // done checking answer just go to the next card
                (async () => {
                    // await this.shiftCardNext(null, id);
                    this.isCorrect = void 0;
                })();
            }
        },

        async shiftCardNext(event: Nullable, id?: string): Promise<void> {
            const cardId = !event ? id : event.target.id;
            this.isCorrect = void 0;
            //update display cards array state
            // to shift a card out of the stack after done using it
            await this.store.dispatch(
                "cards/shiftCardNext" as RootDispatchType,
                cardId,
                { root: true }
            );
        },

        openAnswerInModalIfMobileScreenWidth(card: CardClass): void {
            if (this.isMobile && this.text!.split(" ").length >= 5) {
                this.store.dispatch(
                    "modal/openModal" as RootDispatchType,
                    {
                        title: "Choice" as ModalTitle,
                        context: card,
                        active: true,
                    } as OpenModalPayload,
                    { root: true }
                );
            }
        },
    },
});
</script>
<style lang="scss">
/**
green border
 */
.is-correct {
    /* offset-x | offset-y | blur-radius | spread-radius | color */
    box-shadow: 0px 0px 2px 5px hsl(171deg, 100%, 41%) !important;
}

.is-incorrect {
    box-shadow: 2px 2px 2px 5px hsl(348deg, 86%, 61%) !important;
}

.is-second {
    margin-left: 0.5em;
}

.long-form {
    word-break: break-all;
}

.is-fourth {
    margin-left: 0.5em;
}

/* Tooltip container */
.is-tooltip {
    position: relative;
    display: inline-block;
    /* If you want dots under the hoverable text */
    border-bottom: 1px dotted black;
}

/* Tooltip text */
.is-tooltip .tooltiptext {
    visibility: hidden;
    width: fit-content;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 0.5em 0.5em;
    border-radius: 6px;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    top: -30px;
    z-index: 1;
}

.is-too-long {
    max-width: 100px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.is-tooltip:hover .tooltiptext {
    visibility: visible;
}
</style>
