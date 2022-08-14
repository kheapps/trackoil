import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/home_page.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
  ],
});

// router.beforeEach((to, _, next) => {
//   if (to.name == "admin" && !store.getters.authToken) next("/signin");
//   else next();
// });

export default router;
