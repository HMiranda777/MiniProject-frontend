<template>
    <div style="margin-top: 100px" class="loginpage">
      <v-container>
      <br />
      <h2> L O G I N </h2>
      <v-card max-width="500" elevation="20" color="transparent" class="mx-auto mt-10 pb-10">
        <v-form @submit.prevent ref="form">
          <v-card-text>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
            ></v-text-field>

            <v-text-field
              :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[passwordRules.required, passwordRules.min,passwordRules.rules]"
              :type="show_pass ? 'text' : 'password'"
              label="Password"
              hint="At least 8 characters"
              class="input-group--focused"
              v-model="password"
              @click:append="show_pass = !show_pass"
            ></v-text-field>

          </v-card-text>
          <v-btn class="mr-4" @click="submit()">Login </v-btn>
        </v-form>
        <v-card-text>Create New Account?
          <router-link class="mr-4" to="/signup">Click Here</router-link>
          </v-card-text>
      </v-card>
    </v-container>   
      <v-snackbar  
        :timeout="3000"     
        :value="value"
        fixed
        center
        > 
        {{ message }}
    </v-snackbar>
    </div>
</template>

<script> 
import axios from "axios";
export default {
     data() {
    return {
      email: "",
      show_pass: false,
      password: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      message: null,
      value: false
    };
    },

 methods: {
    submit() {
      if (!this.$refs.form.validate()) return;
      axios
        .post(
          "http://127.0.0.1:5000/userlogin",
          {
            email_id: this.email,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => {
            if (res.data.message) {
              this.message = res.data.message
              this.value = true
            }
              else if (res.data.status) {
              localStorage.setItem("Role", res.data.role)
              localStorage.setItem("Token", res.data.token)
              localStorage.setItem("Email",res.data.email)
              if(res.data.role==="manager")
                window.location = "/manager/dashboard"
              else if (res.data.role === "customer")
                window.location = "/user/dashboard"
              else if (res.data.role === "admin")
                window.location = "/admin/dashboard"
            }

            console.log(res)
                
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

      watch: {
    value() {
      if (this.value) {
        setTimeout(() => {
        this.value=!this.value
      }, 3000);
      }


    }
  }
};  
</script>

<style>
  #app {
  background-image: url("/public/login_background.gif");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1700px 800px;
}
</style>