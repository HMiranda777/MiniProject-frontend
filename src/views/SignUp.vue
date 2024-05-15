<template>
  <div>
    <v-container>
      <br />
      <h2>S I G N U P</h2>
      <v-card max-width="500" elevation="20" color="transparent" class="mx-auto mt-10 pb-10">
        <v-form @submit.prevent ref="form">
          <v-card-text>
            <v-text-field
              v-model="name"
              :counter="15"
              :rules="nameRules"
              label="Username"
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
            ></v-text-field>

            <v-select
              v-model="select"
              :items="items"
              :rules="selectRules"
              label="Select Role"
              required
            ></v-select>
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
            <v-text-field
              :append-icon="show_cpass ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[
                passwordRules.required,
                passwordRules.min,
                passwordRules.passMatch,
                passwordRules.rules,
              ]"
              :type="show_cpass ? 'text' : 'password'"
              label="Confirm Password"
              hint="At least 8 characters"
              class="input-group--focused"
              v-model="confirm_password"
              @click:append="show_cpass = !show_cpass"
            >
            </v-text-field>
          </v-card-text>
          <v-btn class="mr-4" @click="submit()"> Sign Up </v-btn>
          <v-card-text>Already a User?
          <router-link class="mr-4" to="/">Click Here</router-link>
          </v-card-text>
        </v-form>
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
      name: "",
      email: "",
      select: null,
      items: ["Customer", "Manager"],
      show_pass: false,
      show_cpass: false,
      password: "",
      confirm_password: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) =>
          (v.length > 2 && v.length <= 15) || "Name must be 2-15 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        passMatch: (confirm_password) =>
          confirm_password === this.password ||
          "The password and confirm password you entered don't match",
        rules: (v) => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}/.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
      },
      selectRules: [(v) => this.select !== null || "Select one role"],
      message: "",
      value:false,
    };
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) return;
      axios
        .post(
          "http://127.0.0.1:5000/signup",
          {
            username: this.name,
            email_id: this.email,
            role: this.select.toLowerCase(),
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => {
            if (res.data.message){
              this.message = res.data.message
              console.log(this.message)
              this.value = true
            }
            else if (res.data.status && res.data.role=="customer") {
              localStorage.setItem("Role", res.data.role)
              localStorage.setItem("Token", res.data.token)
              localStorage.setItem("Email",res.data.email)
              if (res.data.role === "customer")
                window.location = "/user/dashboard"
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
