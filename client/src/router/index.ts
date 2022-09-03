import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ChangePassword from "@/views/ChangePassword.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: ForgotPassword,
  },
  {
    path: "/changepass/:token",
    name: "ChangePass",
    component: ChangePassword,
  },
  {
    path: "/:catchAll(.*)",
    name: "Redirect",
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
