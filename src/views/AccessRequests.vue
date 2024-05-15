<template>
    <div>
        <NavBar :user="'admin'" :Username="email"></NavBar>
       <v-container mt-10>
        <h3> R E Q U E S T S </h3>
        <br>
        <div class="pb-10" v-for="i in users">
        <v-card class = "mx-auto" max-width = "750" elevation = "4"  outlined>
        <v-card-title class="pb-0">
            Username:  {{ i.username }}
        </v-card-title>
        <v-card-title>
            Email_ID:   {{ i.email }}
        </v-card-title>
        <v-card-actions class=" justify-end pt-0 mb-2 pb-4 pr-0 mr-4">
              <v-btn
                class="ml-2"
                color="#77BB41"
                style="color: whitesmoke"
                @click="AccessGranted(i.email)"
                ><v-icon>mdi-check</v-icon></v-btn
              >
              <v-btn
                class="ml-2"
                color="error"
                style="color: whitesmoke"
                @click="AccessDenied(i.email)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
        </v-card-actions>
        </v-card>
      </div>
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
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
export default {
    data() {
        return {
          users: null,
          auth_token: null,
          email: null,
          value: false,
          message:"",
        }

    },
        components:
    {
        NavBar,
    },
  mounted() {
    this.auth_token = localStorage.getItem("Token")
    this.email=localStorage.getItem("Email")
      this.fetchusers()
    },
    methods: {

        fetchusers: async function() {
      axios
        .get("http://127.0.0.1:5000/user/pending", {
          headers: {
            "Authentication-Token":this.auth_token,
          }
        })
        .then((result) => {
          this.users = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
        },
        AccessGranted(email) {
            axios
                .patch("http://127.0.0.1:5000/user/pending",{
                    email: email,
                }, { headers:{
                  "Content-Type": "application/json",
                    "Authentication-Token":this.auth_token,
                }
                })
        .then((result) => {
          console.log(result)
          this.fetchusers()
          this.message = result.data.message
          console.log(this.message)
          this.value=true
        })
        .catch((err) => {
          console.log(err);
        });

        },
        AccessDenied(email) {

                  axios
                .delete("http://127.0.0.1:5000/user/pending?email="+email, { headers:{
                  "Content-Type": "application/json",
                    "Authentication-Token":this.auth_token,
                }
                })
        .then((result) => {
          console.log(result)
          this.fetchusers()
          this.message = result.data.message
          console.log(this.message)
          this.value=true
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
 
}
</script>