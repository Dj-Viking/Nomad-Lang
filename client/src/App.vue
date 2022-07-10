<template>
    <Transition name="fade" type="transition">
        <div v-if="activeClass">
            <div>
                <Modal />
            </div>
        </div>
        <div v-else>
            <SideBar />
            <router-view />
        </div>
    </Transition>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import Modal from "./components/Modal.vue";
import SideBar from "./components/SideBar.vue";
import { MyRootState, RootCommitType } from "./types";
export default defineComponent({
    name: "App",
    components: {
        Modal,
        SideBar,
    },
    setup() {
        const store = useStore<MyRootState>();
        const isMobile = computed(() => store.state.mobile.mobile.isMobile);
        const activeClass = computed(() => store.state.modal.modal.activeClass);
        return { activeClass, store, isMobile };
    },
    mounted() {
        // set global isMobile width state.
        const MediaQueryList = window.matchMedia("(max-width: 600px)");
        console.log("media query list interface", MediaQueryList);
        if (MediaQueryList.matches) {
            this.store.commit(
                "mobile/TOGGLE_ISMOBILE" as RootCommitType,
                window.innerWidth,
                { root: true }
            );
        } else
            this.store.commit(
                "mobile/TOGGLE_ISMOBILE" as RootCommitType,
                false,
                { root: true }
            );
        if (window.innerWidth <= 600) {
            console.log("on app mount width is smaller or the same as 600");

            this.store.commit(
                "mobile/TOGGLE_ISMOBILE" as RootCommitType,
                window.innerWidth,
                { root: true }
            );
        }

        MediaQueryList.onchange = (e) => {
            console.log("query list changed ion change callback called ", e);
            if (e.matches)
                this.store.commit(
                    "mobile/TOGGLE_ISMOBILE" as RootCommitType,
                    window.innerWidth,
                    { root: true }
                );
            else {
                this.store.commit(
                    "mobile/TOGGLE_ISMOBILE" as RootCommitType,
                    false,
                    { root: true }
                );
            }
        };

        const theme = window.localStorage.getItem("theme");
        if (!theme) {
            document.body.classList.add("body-light");
        } else {
            switch (true) {
                case theme === "light":
                    {
                        document.body.classList.remove("body-dark");
                        document.body.classList.add("body-light");
                        // eslint-disable-next-line
                        document.querySelector("html")!.style.backgroundColor =
                            "white";
                    }
                    break;
                case theme === "dark":
                    {
                        document.body.classList.remove("body-light");
                        document.body.classList.add("body-dark");
                        // eslint-disable-next-line
                        document.querySelector("html")!.style.backgroundColor =
                            "#222222";
                    }
                    break;
            }
        }
    },
});
</script>

<style lang="scss">
#app {
    font-family: "Grechen Fuemen", cursive;
    font-family: "Imbue", serif;
    font-family: "Kosugi Maru", sans-serif;
    font-family: "Roboto", sans-serif;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.show-me {
    display: block;
}
.hide-me {
    display: none;
}
</style>
