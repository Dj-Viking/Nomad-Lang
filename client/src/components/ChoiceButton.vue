<template>
    <button
        style="margin-bottom: 1.5rem"
        type="button"
        :id="card!._id"
        :value="`${text}`"
        class="button is-info"
        :class="{ 'is-second': order === 2, 'is-fourth': order === 4, 'is-correct': isCorrect === true, 'is-incorrect': isCorrect === false }"
        @click.prevent="(e) => {
            submitCardFlipCheck(e, true)
        }"
    >
        {{ text || "nothing yet" }}
    </button>
</template>

<!-- huh... is this thing still connected? If so, hello.  -->
<!-- hey it's late go to bed! -->
<!-- shoot, I should probably close the live-share session after I'm done huh lol -->
<script lang="ts">
import { CardClass, MyRootState, RootCommitType, RootDispatchType } from "@/types";
import { defineComponent, ref, PropType } from "@vue/runtime-core";
import { useStore } from "vuex";
export default defineComponent({
    name: "ChoiceButton.vue",
    props: {
        order: Number,
        card: Object as PropType<CardClass>,
        text: String
    },
    setup() {
        const isCorrect = ref();
        const store = useStore<MyRootState>();
        const example = ref<string>("works");
        return { example, store, isCorrect };
    },
    methods: {
        submitCardFlipCheck(event: any, _isFrontSide: boolean): void {
            const id = event.target.id;
            const text = event.target.value;
            console.log("id and text after clicking", id, text);
            if (_isFrontSide) {
                if (text === this.card?.backSideText) {
                    this.isCorrect = true;
                    // increment correct score
                    this.store.commit("user/INCREMENT_CORRECT" as RootCommitType, null, { root: true });
                    // TODO: display message on card that it was right
                    // increment the user's score when right
                    // after some time flip the card back to the front and go to the next card in the CardList being displayed
                } else {
                    this.isCorrect = false;
                    // increment incorrect score
                    this.store.commit("user/INCREMENT_INCORRECT" as RootCommitType, null, { root: true });
                    // TODO display message on card that it was wrong
                    // decrement the user's score and then show the answer
                    // on the backside, after some time flip back to front and then
                    // go to the next card in the CardList
                }
                //set the class on for the flip animation on the card object itself.
                // this.store.commit(
                //     "cards/TOGGLE_CARD_SIDE" as RootCommitType, id, { root: true }
                // );

            } else { //is backside, just flip without checking translation
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

        async shiftCardNext(event?: any, id?: string): Promise<void> {
            const cardId = !event ? id : event.target.id;
            //update display cards array state
            // to shift a card out of the stack after done using it
            await this.store.dispatch("cards/shiftCardNext" as RootDispatchType, cardId, { root: true });
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

.is-fourth {
    margin-left: 0.5em;
}
</style>