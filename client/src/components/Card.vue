<template>
    <Transition type="transition" name="fade" mode="out-in">
        <div v-if="!isLoading">
            <TransitionGroup type="transition" name="slide-fade" mode="out-in">
                <div :key="keyGen()" v-if="card!.isFrontSide">
                    <div class="card">
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                            "
                        >
                            <i
                                style="
                                    color: #f14668;
                                    font-size: 30px;
                                    margin-top: 0.2em;
                                    margin-left: 0.4em;
                                    margin-bottom: 0.4em;
                                    cursor: pointer;
                                "
                                class="fa fa-trash"
                                @click.prevent="
                                    ($event) => {
                                        //update vuex cards that are displayed
                                        openDeleteCardModal($event, id!);
                                    }
                                "
                            ></i>
                            <button
                                class="button is-primary ml-6"
                                style="
                                    color: black;
                                    margin-top: 0.3em;
                                    margin-right: 0.4em;
                                "
                                @click.prevent="
                                    ($event) => {
                                        openEditModal($event, card!);
                                    }
                                "
                            >
                                Edit
                                <i
                                    style="margin-left: 0.5em"
                                    class="fa fa-pencil-square-o"
                                >
                                </i>
                            </button>
                        </div>
                        <!-- <div class="card-image">
                            <figure class="image is-4by3">
                                <img
                                src="https://bulma.io/images/placeholders/1280x960.png"
                                alt="Placeholder image"
                                />
                            </figure>
                        </div> -->
                        <div class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <div
                                        v-if="/<strong>/g.test(card?.frontSideText!)"
                                    >
                                        <p v-html="card?.frontSideText"></p>
                                    </div>
                                    <div v-else>
                                        <p
                                            style="margin-bottom: 1.5rem"
                                            class="title is-5"
                                        >
                                            {{ card?.frontSideText }}
                                        </p>
                                    </div>
                                    <form
                                        :id="id"
                                        @submit.prevent="
                                            ($event) => {
                                                (async () => {
                                                    await submitCardFlipCheck(
                                                        $event,
                                                        true
                                                    );
                                                })();
                                            }
                                        "
                                    >
                                        <div
                                            style="
                                                margin-bottom: 1.5rem;
                                                display: flex;
                                                flex-wrap: wrap;
                                                flex-direction: column;
                                                justify-content: center;
                                            "
                                            id="answer-container"
                                        >
                                            <div
                                                style="
                                                    display: flex;
                                                    flex-direction: row;
                                                    justify-content: center;
                                                "
                                            >
                                                <ChoiceButton
                                                    :order="1"
                                                    :choiceId="`choice-1-${card?._id}`"
                                                    :card="card"
                                                    :text="card?.choices![0].text || `nothing yet`"
                                                />
                                                <ChoiceButton
                                                    :order="2"
                                                    :choiceId="`choice-2-${card?._id}`"
                                                    :card="card"
                                                    :text="card?.choices![1].text || `nothing yet`"
                                                />
                                            </div>
                                            <div
                                                style="
                                                    display: flex;
                                                    flex-direction: row;
                                                    justify-content: center;
                                                "
                                            >
                                                <ChoiceButton
                                                    :order="3"
                                                    :card="card"
                                                    :choiceId="`choice-3-${card?._id}`"
                                                    :text="card?.choices![2].text || `nothing yet`"
                                                />
                                                <ChoiceButton
                                                    :order="4"
                                                    :card="card"
                                                    :choiceId="`choice-4-${card?._id}`"
                                                    :text="card?.choices![3].text || `nothing yet`"
                                                />
                                            </div>
                                        </div>
                                        <input
                                            autocomplete="off"
                                            id="translation-input"
                                            style="
                                                margin: 0 auto;
                                                width: 80%;
                                                visibility: hidden;
                                            "
                                            class="input"
                                            type="text"
                                            placeholder="Translate!"
                                        />
                                        <button
                                            id="check-answer-btn"
                                            class="button is-primary"
                                            style="
                                                color: black;
                                                margin-top: 1.5rem;
                                            "
                                            type="submit"
                                        >
                                            Check
                                        </button>
                                    </form>
                                    <button
                                        :id="id!"
                                        type="submit"
                                        style="margin-top: 1.5rem"
                                        class="button is-warning"
                                        @click.prevent="
                                            ($event) => {
                                                (async () => {
                                                    shiftCardNext($event);
                                                })();
                                            }
                                        "
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- is not front side -->
                <div :key="keyGen() + 'asdfkjsdkfjdkjf'" v-else>
                    <div class="card">
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                            "
                        >
                            <i
                                style="
                                    color: #f14668;
                                    font-size: 30px;
                                    margin-top: 0.2em;
                                    margin-left: 0.4em;
                                    margin-bottom: 0.4em;
                                    cursor: pointer;
                                    visibility: hidden;
                                "
                                class="fa fa-trash"
                                @click.prevent="
                                    ($event) => {
                                        //update vuex cards that are displayed
                                        openDeleteCardModal($event, id!);
                                    }
                                "
                            ></i>
                            <button
                                class="button is-primary ml-6"
                                style="
                                    color: black;
                                    margin-top: 0.3em;
                                    margin-right: 0.4em;
                                    visibility: hidden;
                                "
                                @click.prevent="
                                    ($event) => {
                                        openEditModal($event, card!);
                                    }
                                "
                            >
                                Edit
                                <i
                                    style="margin-left: 0.5em"
                                    class="fa fa-pencil-square-o"
                                >
                                </i>
                            </button>
                        </div>
                        <!-- <div class="card-image">
                            <figure class="image is-4by3">
                                <img
                                src="https://bulma.io/images/placeholders/1280x960.png"
                                alt="Placeholder image"
                                />
                            </figure>
                        </div> -->
                        <div class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <div
                                        v-if="/<strong>/g.test(card?.backSideText!)"
                                    >
                                        <p v-html="card?.backSideText"></p>
                                    </div>
                                    <div
                                        style="
                                            max-width: fit-content;
                                            margin: 0 auto;
                                        "
                                        v-else
                                    >
                                        <p
                                            style="
                                                margin-bottom: 1.5rem;
                                                line-height: 1.5rem;
                                            "
                                            class="title is-5"
                                        >
                                            {{ card?.backSideText }}
                                        </p>
                                    </div>
                                    <form
                                        :id="id"
                                        @submit.prevent="
                                            ($event) => {
                                                (async () => {
                                                    await shiftCardNext(
                                                        $event,
                                                        id
                                                    );
                                                })();
                                            }
                                        "
                                    >
                                        <div
                                            style="
                                                margin-bottom: 1.5rem;
                                                max-width: fit-content;
                                                visibility: hidden;
                                            "
                                            id="answer-container"
                                        >
                                            <ChoiceButton
                                                :order="1"
                                                :card="card"
                                                :text="card?.backSideText"
                                            />
                                            <ChoiceButton
                                                :order="2"
                                                :card="card"
                                                :text="card?.choices![0].text"
                                            />
                                            <ChoiceButton
                                                :order="3"
                                                :card="card"
                                                :text="card?.choices![1].text"
                                            />
                                            <ChoiceButton
                                                :order="4"
                                                :card="card"
                                                :text="card?.choices![2].text"
                                            />
                                        </div>
                                        <input
                                            autocomplete="off"
                                            id="translation-input"
                                            style="
                                                margin: 0 auto;
                                                width: 80%;
                                                visibility: hidden;
                                            "
                                            class="input"
                                            type="text"
                                            placeholder="Translate!"
                                        />
                                        <button
                                            id="check-answer-btn"
                                            class="button is-primary"
                                            style="
                                                color: black;
                                                margin-top: 1.5rem;
                                                padding-left: 26px;
                                                padding-right: 26px;
                                            "
                                            type="submit"
                                        >
                                            Flip
                                        </button>
                                    </form>
                                    <button
                                        :id="id!"
                                        type="submit"
                                        style="
                                            margin-top: 1.5rem;
                                            visibility: hidden;
                                        "
                                        class="button is-warning"
                                        @click.prevent="
                                            ($event) => {
                                                (async () => {
                                                    shiftCardNext($event);
                                                })();
                                            }
                                        "
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TransitionGroup>
        </div>
        <div v-else>
            <div style="height: 0; margin: 0; padding: 0">
                <Spinner />
            </div>
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from "@vue/runtime-core";
import Spinner from "../components/Spinner.vue";
import {
    CardClass,
    ICard,
    MyRootState,
    RootCommitType,
    RootDispatchType,
} from "@/types";
import { keyGen } from "@/utils/keyGen";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import ChoiceButton from "../components/ChoiceButton.vue";
export default defineComponent({
    name: "Card",
    components: {
        Spinner,
        ChoiceButton,
    },
    props: {
        choices: Object as PropType<string[]>,
        card: Object as PropType<CardClass>,
        cards: Array as PropType<Array<CardClass>>,
        id: String,
    },
    setup() {
        const toast = useToast();
        const store = useStore<MyRootState>();
        const all_cards = computed(() => store.state.cards.allCards);
        const my_cards = computed(() => store.state.cards.cards);
        const isLoading = computed(() => store.state.loading.loading.isLoading);
        const isLoggedIn = computed(() => store.state.user.user.loggedIn);
        const activeClass = computed(() => store.state.modal.modal.activeClass);
        return {
            all_cards,
            my_cards,
            toast,
            keyGen,
            store,
            isLoading,
            isLoggedIn,
            activeClass,
        };
    },
    methods: {
        openDeleteCardModal(_event: Event, id: string): void {
            this.store.commit(
                "modal/SET_MODAL_TITLE" as RootCommitType,
                "Delete This Card",
                {
                    root: true,
                }
            );
            this.store.commit(
                "modal/SET_MODAL_CONTEXT" as RootCommitType,
                { _id: id },
                {
                    root: true,
                }
            );
            this.store.commit(
                "modal/SET_MODAL_ACTIVE" as RootCommitType,
                true,
                {
                    root: true,
                }
            );
        },
        async submitCardFlipCheck(
            event: any,
            _isFrontSide: boolean
        ): Promise<void> {
            const id = event.target.id;
            if (_isFrontSide) {
                //set the class on for the flip animation on the card object itself.
                this.store.commit(
                    "cards/TOGGLE_CARD_SIDE" as RootCommitType,
                    id,
                    { root: true }
                );
            } else {
                //is backside, just flip without checking translation
                this.store.commit(
                    "cards/TOGGLE_CARD_SIDE" as RootCommitType,
                    id,
                    { root: true }
                );
                // done checking answer just go to the next card
                await this.shiftCardNext(null, id);
            }
        },
        async shiftCardNext(event?: any, id?: string): Promise<void> {
            const cardId = (() => (!event ? id : event.target.id))();
            //update display cards array state
            // to shift a card out of the stack after done using it
            await this.store.dispatch(
                "cards/shiftCardNext" as RootDispatchType,
                cardId,
                { root: true }
            );
        },
        // eslint-disable-next-line
        openEditModal(_event: Event, card: ICard) {
            this.store.commit("modal/SET_MODAL_TITLE", "Edit a card", {
                root: true,
            });
            this.store.commit(
                "modal/SET_MODAL_CONTEXT" as RootCommitType,
                card,
                {
                    root: true,
                }
            );
            this.store.commit(
                "modal/SET_MODAL_ACTIVE" as RootCommitType,
                true,
                {
                    root: true,
                }
            );
        },
    },
    mounted() {
        if (this.card) {
            setTimeout(() => {
                this.store.commit(
                    "loading/SET_LOADING" as RootCommitType,
                    false,
                    {
                        root: true,
                    }
                );
            }, 500);
        }
    },
});
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity height 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    height: 0;
}

/*
make some kind of class for the card 'flipping'
*/

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

/* .slide-fade-leave-active below version 2.1.8 */
.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(100px);
    opacity: 0;
}
</style>
