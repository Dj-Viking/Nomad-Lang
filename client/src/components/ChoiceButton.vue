<template>
    <button
        style="margin-bottom: 1.5rem"
        type="button"
        :id="card!._id"
        :value="`${text}`"
        class="button is-info"
        @click.prevent="(e) => {
            submitCardFlipCheck(e, true)
        }"
    >
        {{ text || "nothing yet" }}
    </button>
</template>
<script lang="ts">
import { CardClass, MyRootState, RootCommitType, RootDispatchType } from "@/types";
import { defineComponent, ref, PropType } from "@vue/runtime-core";
import { useStore } from "vuex";
export default defineComponent({
    name: "ChoiceButton.vue",
    props: {
        card: Object as PropType<CardClass>,
        text: String
    },
    setup() {
        const store = useStore<MyRootState>();
        const example = ref<string>("works");
        return { example, store };
    },
    methods: {
        submitCardFlipCheck(event: any, _isFrontSide: boolean): void {
            const id = event.target.id;
            const text = event.target.value;
            console.log("id and text after clicking", id, text);
            if (_isFrontSide) {
                if (new RegExp(`^${this.card!.backSideText}$`, "i").test(text)) {
                    // increment correct score
                    this.store.commit("user/INCREMENT_CORRECT" as RootCommitType, null, { root: true });
                    // TODO: display message on card that it was right
                    // increment the user's score when right
                    // after some time flip the card back to the front and go to the next card in the CardList being displayed
                } else {
                    // increment incorrect score
                    this.store.commit("user/INCREMENT_INCORRECT" as RootCommitType, null, { root: true });
                    // TODO display message on card that it was wrong
                    // decrement the user's score and then show the answer
                    // on the backside, after some time flip back to front and then
                    // go to the next card in the CardList
                }
                //set the class on for the flip animation on the card object itself.
                this.store.commit(
                    "cards/TOGGLE_CARD_SIDE" as RootCommitType, id, { root: true }
                );
            } else { //is backside, just flip without checking translation
                this.store.commit(
                    "cards/TOGGLE_CARD_SIDE" as RootCommitType, id, { root: true }
                );
                // done checking answer just go to the next card
                (async () => {
                    console.log("ksdjfkdj");

                    await this.shiftCardNext(null, id);
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
</style>