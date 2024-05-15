<template>
  <div id="app" class="mb-16">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top container-fluid">
    <h5 style="color: white">{{ Username }}'s Dashboard</h5>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ml-auto">
                  <button
          v-if="user === 'manager'"
          class="btn mr-4"
          style="background-color: #77bb41; color: white"
          @click="exportReport"
        >
          Summary
        </button>
        <router-link
          v-if="user === 'customer' && $route.path !== '/cart'"
          to="/cart"
          style="text-decoration: none"
          ><button
            class="btn mr-4"
            style="background-color: #77bb41; color: white"
          >
            Cart
          </button></router-link
        >
        <router-link
          v-if="user === 'customer' && $route.path !== '/user/dashboard'"
          to="/user/dashboard"
          style="text-decoration: none"
          ><button
            class="btn mr-4"
            style="background-color: #77bb41; color: white"
          >
            Home
          </button></router-link
        >
        <router-link
          v-if="user === 'manager' && $route.path !== '/manager/dashboard'"
          to="/manager/dashboard"
          style="text-decoration: none"
          ><button
            class="btn mr-4"
            style="background-color: #77bb41; color: white"
          >
            Home
          </button></router-link
        >
        <router-link
          v-if="user === 'admin' && $route.path !== '/admin/dashboard'"
          to="/admin/dashboard"
          style="text-decoration: none"
          ><button
            class="btn mr-4"
            style="background-color: #77bb41; color: white"
          >
            Home
          </button></router-link
        >
        <router-link
          v-if="user === 'admin' && $route.path === '/admin/dashboard'"
          to="/admin/requests"
          ><button
            class="btn mr-4"
            style="background-color: #77bb41; color: white"
          >
            Requests
          </button>
        </router-link>
        <div>
                  <button
          class="btn"
          @click="Logout()"
          style="background-color: #77bb41; color: white"
        >
          Logout
        </button>
        </div>
        </div>
      </div>
    </nav>
  </div>
</template>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.btn {
  margin-right: 5%;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import axios from "axios";

export default {
  data() {
    return {
      auth_token: null,
      report_id: null,
    };
  },

  props: {
    Username: {},
    user: {},
  },
  mounted() {
    this.auth_token = localStorage.getItem("Token");
  },

  methods: {
    Logout() {
      localStorage.clear();
      window.location = "/";
    },
    exportReport: async function () {
      axios
        .get("http://127.0.0.1:5000/report/csv", {
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.auth_token,
          },
        })
        .then((result) => {
          console.log(result);
          if (result.statusText === "OK") {
            const data = result.data;
            const report_id = data["id"];
            const interval = setInterval(async () => {
              axios
                .get("http://127.0.0.1:5000/csv/" + report_id, {
                  headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": this.auth_token,
                  },
                })
                .then((response) => {
                  console.log(response);
                  if (response.statusText === "OK") {
                    clearInterval(interval);
                    window.location.href="http://127.0.0.1:5000/csv/"+report_id
                  }
                });
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

