import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

var token = localStorage.getItem("Token");
var role = localStorage.getItem("Role");

const routes = [
  {
    path: "/signup",
    name: "Signup",
    component: () =>
      import(/* webpackChunkName: "managerdashboard" */ "../views/SignUp.vue"),
  },
  {
    path: "/",
    name: "Login",
    component: () =>
      import(
        /* webpackChunkName: "managerdashboard" */ "../views/LoginPage.vue"
      ),
  },

  {
    path: "/admin/requests",
    name: "AdminAccessRequqestsDashboard",
    component: () =>
      import(/* webpackChunkName: "cart" */ "../views/AccessRequests.vue"),
    beforeEnter: (to, from, next) => {
      if (token && role === "admin") {
        next();
      } else {
        localStorage.clear();
        next("/");
      }
    },
  },

  {
    path: "/manager/dashboard",
    name: "ManagerDashboard",
    component: () =>
      import(
        /* webpackChunkName: "managerdashboard" */ "../views/ManagerDashboard.vue"
      ),
    beforeEnter: (to, from, next) => {
      if (token && role === "manager") {
        next();
      } else {
        localStorage.clear();
        next("/");
      }
    },
  },

  {
    path: "/user/dashboard",
    name: "UserDashboard",
    component: () =>
      import(
        /* webpackChunkName: "userdashboard" */ "../views/UserDashboard.vue"
      ),
    beforeEnter: (to, from, next) => {
      if (token && role === "customer") {
        next();
      } else {
        localStorage.clear();
        next("/");
      }
    },
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () =>
      import(/* webpackChunkName: "cart" */ "../views/AdminDashboard.vue"),
    beforeEnter: (to, from, next) => {
      if (token && role === "admin") {
        next();
      } else {
        localStorage.clear();
        next("/");
      }
    },
  },
  {
    path: "/cart",
    name: "CartPage",
    component: () =>
      import(/* webpackChunkName: "cart" */ "../views/CustomerCart.vue"),
    beforeEnter: (to, from, next) => {
      if (token && role === "customer") {
        next();
      } else {
        localStorage.clear();
        next("/");
      }
    },
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
