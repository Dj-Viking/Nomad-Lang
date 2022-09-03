ChangeThemePrefResponse,
<template>
    <Transition type="transition" name="fade" mode="out-in">
        <div v-if="sidebarOpen || cards.length > 0" style="width: 100px">
            <div
                :class="{
                    'toggle-slot-light': isLight,
                    'toggle-slot-dark': isDark,
                }"
                @click.prevent="
                    ($event) => {
                        (async () => {
                            await toggleTheme($event);
                        })();
                    }
                "
            >
                &nbsp;
            </div>
            <button
                id="toggle-btn"
                type="button"
                @click.prevent="
                    ($event) => {
                        (async () => {
                            await toggleTheme($event);
                        })();
                    }
                "
                class="button"
                :class="{
                    'my-toggle-light': isLight,
                    'my-toggle-dark': isDark,
                }"
            >
                <i
                    :class="{ 'fa fa-sun-o': isLight, 'fa fa-moon-o': isDark }"
                ></i>
            </button>
        </div>
        <div v-else>
            <div></div>
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent, computed } from "@vue/runtime-core";
import { ChangeThemePrefResponse, MyRootState, RootCommitType } from "@/types";
import store from "../store";
import { useToast } from "vue-toastification";
import { api } from "@/utils/ApiService";
import auth from "@/utils/AuthService";
import { useStore } from "vuex";
export default defineComponent({
    name: "ToggleButton",
    setup() {
        const toast = useToast();
        const store = useStore<MyRootState>();
        const sidebarOpen = computed(() => store.state.sidebar.sidebar.isOpen);
        const cards = computed(() => store.state.cards.cards);
        const isLoggedIn = computed(() => store.state.user.user.loggedIn);
        const isLight = computed(() => store.state.theme.theme === "light");
        const isDark = computed(() => store.state.theme.theme === "dark");
        return {
            toast,
            sidebarOpen,
            cards,
            isLoggedIn,
            isLight,
            isDark,
        };
    },
    methods: {
        // eslint-disable-next-line
        async toggleTheme(_event: any): Promise<void> {
            store.commit(
                "theme/TOGGLE_THEME" as RootCommitType,
                {},
                { root: true }
            );
            if (this.isLoggedIn) {
                await this.submitThemePrefChange(
                    this.isLight ? "light" : "dark"
                );
            }
        },
        async submitThemePrefChange(theme_input: string): Promise<void> {
            try {
                const { error } = (await api.changeThemePref(
                    auth.getToken() as string,
                    theme_input
                )) as ChangeThemePrefResponse;
                if (!!error) throw new Error(error as string);
            } catch (error) {
                console.error(error);
                const err = error as Error;
                this.toast.error(
                    `There was an error during changing the theme: ${err.message}`
                );
            }
        },
    },
});
</script>
<style lang="scss"></style>
