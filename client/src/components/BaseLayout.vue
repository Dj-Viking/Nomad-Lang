<template>
    <div
        :class="{
            'content-shrink': sidebarOpen,
            'content-adjust': !sidebarOpen,
        }"
    >
        <nav style="margin: 0">
            <Transition type="transition" name="fade" mode="out-in">
                <div v-if="!isHome">
                    <div class="nav-buttons">
                        <div class="nav-animate-in">
                            <router-link
                                style="text-decoration: none"
                                class="button is-success"
                                :to="'/'"
                                >Home</router-link
                            >
                        </div>
                    </div>
                </div>
                <div v-else>
                    <Transition type="transition" name="fade" mode="out-in">
                        <div v-if="isLoggedIn" class="nav-buttons">
                            <a
                                style="cursor: pointer"
                                class="button is-danger"
                                @click.prevent="
                                    ($event) => {
                                        readEvent($event);
                                        logout();
                                    }
                                "
                                >Logout</a
                            >
                        </div>
                        <div v-else class="nav-buttons">
                            <div class="nav-animate-in">
                                <router-link
                                    style="
                                        text-decoration: none;
                                        margin-right: 0.5em;
                                    "
                                    class="button is-success"
                                    :to="'/login'"
                                    >Login</router-link
                                >
                                <router-link
                                    style="text-decoration: none"
                                    class="button is-success"
                                    :to="'/signup'"
                                    >Signup</router-link
                                >
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </nav>
        <slot />
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { defineComponent, computed } from "vue";
import {
    MeQueryResponse,
    MyRootState,
    RootCommitType,
    RootDispatchType,
} from "../types";
import auth from "../utils/AuthService";
// import { keyGen } from "@/utils/keyGen";
import { api } from "@/utils/ApiService";
import { useStore } from "vuex";
import { keyGen } from "@/utils/keyGen";
import { shuffleArray } from "@/utils/shuffleArray";
export default defineComponent({
    name: "BaseLayout",
    props: {
        isHome: Boolean,
    },
    setup() {
        const store = useStore<MyRootState>();
        const isLoggedIn = computed(() => store.state.user.user.loggedIn);
        const sidebarOpen = computed(() => store.state.sidebar.sidebar.isOpen);
        return { isLoggedIn, store, sidebarOpen };
    },
    methods: {
        // eslint-disable-next-line
        readEvent(_event: Event): void {
            //do nothing
        },
        logout() {
            auth.clearToken();
            this.store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
                root: true,
            });
            //refetching after setting the token to
            //empty string will not allow for a refresh token on the site
            // this.refetch();
            this.store.commit(
                "cards/SET_DISPLAY_CARDS" as RootCommitType,
                { cards: [] },
                {
                    root: true,
                }
            );
        },
    },
    async mounted() {
        if (!auth.getToken()) return;
        const { user, error } = await api.me(auth.getToken() as string);
        if (!!error) {
            // console.error("error during me query on mount!", error);
            auth.clearToken();
            this.store.commit("user/SET_LOGGED_IN" as RootCommitType, false, {
                root: true,
            });
            return;
        }

        //set logged in
        this.store.commit("user/SET_LOGGED_IN" as RootCommitType, true, {
            root: true,
        });
        // set user
        this.store.commit(
            "user/SET_USER" as RootCommitType,
            { ...user },
            { root: true }
        );

        // set cards if any
        if (user!.cards.length > 0) {
            const choicesForUpdating = new Array(3).fill(null).map(() => {
                return {
                    text: shuffleArray([..."aeiousvk".split("")]).join(""),
                };
            });

            await this.store.dispatch(
                "cards/setCards" as RootDispatchType,
                {
                    //set choices if null create fake ones here
                    cards: user!.cards,
                    choices: new Array(3).fill(null).map(() => {
                        return {
                            id: keyGen(),
                            text: shuffleArray([..."aeiousvk".split("")]).join(
                                ""
                            ),
                        };
                    }),
                },
                { root: true }
            );

            // update the cards choices in the user's DB
            if (user!.cards[0]!.choices?.length === 0) {
                // api call for updating the cards if they dont have chocies
                // when initially coming from the database
                const { er } = await api.addChoicesToCards(
                    choicesForUpdating,
                    auth.getToken() as string
                );
                if (er) throw er;
            }
        }
        // set theme
        this.store.commit(
            "theme/SET_THEME" as RootCommitType,
            user!.themePref,
            {
                root: true,
            }
        );
    },
    watch: {
        //callback to refresh user token to execute whenever the application router changes
        $route: async function () {
            try {
                if (this.isLoggedIn) {
                    const { user, error } = (await api.me(
                        auth.getToken() as string
                    )) as MeQueryResponse;
                    if (!!error) {
                        auth.clearToken();
                        this.store.commit(
                            "user/SET_LOGGED_IN" as RootCommitType,
                            false,
                            {
                                root: true,
                            }
                        );
                        return;
                    }
                    auth.setToken(user?.token as string);
                    /// set user
                    this.store.dispatch(
                        "user/setUser" as RootDispatchType,
                        { ...user },
                        {
                            root: true,
                        }
                    );
                }
            } catch (error) {
                auth.clearToken();
                this.store.commit(
                    "user/SET_LOGGED_IN" as RootCommitType,
                    false,
                    {
                        root: true,
                    }
                );
                // console.error("error in $route navigation", error);
            }
        },
    },
});
</script>
<style lang="scss" scoped>
.nav-buttons {
    display: flex;
    justify-content: flex-end;
    margin: 0.5em;
}

.divider {
    color: green;
    font-size: 40px;
    margin-left: 10px;
    margin-right: 10px;
}

.link {
    color: green;
    font-size: 40px;
}

@keyframes animatein {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.content-shrink {
    margin-left: 100px;
    margin-right: 0px !important;
    transition: 0.2s;
}

.content-adjust {
    margin-left: 0px !important;
    margin-right: 0px !important;
    transition: 0.2s ease 0.3s;
}

.nav-animate-in {
    animation-name: animatein;
    animation-duration: 2s;
    animation-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
