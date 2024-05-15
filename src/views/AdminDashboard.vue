<template>
  <div>
    <NavBar :user="'admin'" :Username="email"></NavBar>
    <v-container mt-10>
      <h1>Category Approval list</h1>
      <br />
      <v-row class="pb-10" v-for="i in category">
        <v-col style="font-family: Borel" cols="12">
          <v-card elevation="4"  class="pt-4">
            <v-card-title v-if="i.task==='Edit'"
              style="display: inline; text-align: center; padding: 0%"
              >Request: Change name from {{ i.category_name | capitalize }} to {{ i.new_category_name | capitalize }} - {{ i.task }}
              <v-btn
                class="ml-2"
                color="#77BB41"
                style="color: whitesmoke"
                @click="categoryAccepted(i.category_id,i.task)"
                ><v-icon>mdi-check</v-icon></v-btn
              >
              <v-btn
                class="ml-2"
                color="error"
                style="color: whitesmoke"
                @click="categoryRejected(i.category_id,i.task)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-card-title>
            <v-card-title v-else
              style="display: inline; text-align: center; padding: 0%"
              >{{ i.category_name | capitalize }} - {{ i.task }}
              <v-btn
                class="ml-2"
                color="#77BB41"
                style="color: whitesmoke"
                @click="categoryAccepted(i.category_id,i.task)"
                ><v-icon>mdi-check</v-icon></v-btn
              >
              <v-btn
                class="ml-2"
                color="error"
                style="color: whitesmoke"
                @click="categoryRejected(i.category_id,i.task)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-card-title>
            <br />
          </v-card>
        </v-col>
      </v-row>
      <br />
      <h1>Product Approval list</h1>
      <v-row class="pb-10">
        <v-col v-for="j in products" :key="j.product_id" cols="12" md="6" lg="4">
<!-- CARD FOR EDIT PRODUCT APPROVAL  -->
          <v-card  v-if="j.task==='Edit'" class="pb-10" max-width="300" elevation="4" outlined>
            <v-card-title style="font-family: Borel">
              {{ j.product_name | capitalize }} - {{ j.task }}
            </v-card-title>
            <hr/>
            <v-card-body>
              <h5>Changes:</h5>
              {{ j.rate_per_unit }} - {{ j.new_rate_per_unit }}
              <br>
               {{ j.unit }} - {{j.new_unit}}
               <br>
               {{ j.quantity }} - {{ j.new_quantity }}
              <hr />
              <v-btn color="#77BB41" style="color: whitesmoke" @click="productAccepted(j.product_id,j.task)">Accept</v-btn>
              <v-btn class="ml-12" color="error" style="color: whitesmoke" @click="productRejected(j.product_id,j.task)"
                >Reject</v-btn
              >
            </v-card-body>
          </v-card>
<!-- CARD FOR PRODUCT DELETE/ADD APPROVAL -->
             <v-card v-else class="pb-10" max-width="300" elevation="4" outlined>
            <v-card-title style="font-family: Borel">
              {{ j.product_name | capitalize }} - {{ j.task }}
            </v-card-title>
            <v-card-body>
              {{ j.rate_per_unit }} {{ j.unit }} {{ j.quantity }}
              <hr />
              <v-btn color="#77BB41" style="color: whitesmoke" @click="productAccepted(j.product_id,j.task)">Accept</v-btn>
              <v-btn class="ml-12" color="error" style="color: whitesmoke" @click="productRejected(j.product_id,j.task)"
                >Reject</v-btn
              >
            </v-card-body>
          </v-card>
        </v-col>
      </v-row>
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
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
export default {
  data() {
    return {
      category: [],
      products: [],
      auth_token: null,
      email: null,
      value: false,
      message:"",
    };
  },
  components: {
    NavBar,
  },
  mounted() {
    this.auth_token = localStorage.getItem("Token")
    this.email=localStorage.getItem("Email")
    this.fetchdata();
    this.fetchproducts();
  },
  methods: {
    fetchdata: async function () {
      axios
        .get("http://127.0.0.1:5000/category/pending", {
          headers: {
            "Authentication-Token":this.auth_token,
          }
        })
        .then((result) => {
          this.category = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchproducts: async function () {
       axios
         .get("http://127.0.0.1:5000/products/pending", {
           headers: {
            "Authentication-Token":this.auth_token,
          }
        })
        .then((result) => {
          this.products = result.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },


    categoryAccepted(category_id, task) {
       console.log(this.auth_token)
        axios
          .patch("http://127.0.0.1:5000/category/pending?category_id="+category_id+"&task="+task,null,{
            headers:
            {
              "Content-Type": "application/json",
              "Authentication-Token":this.auth_token,
            }
          })
          .then((result) => {
            this.fetchdata()
            this.fetchproducts()
            this.message = result.data.message
            console.log(this.message)
            this.value=true
              
          })
          .catch((err) => {
            console.log(err);
          })
    },
    categoryRejected(category_id,task){
        axios
        .delete("http://127.0.0.1:5000/category/pending?category_id="+category_id+"&task="+task,{
            headers:
            {
            "Content-Type": "application/json",
            "Authentication-Token":this.auth_token,
            }
          })
          .then((result) => {
            this.fetchdata()
            this.fetchproducts()
            this.message = result.data.message
            console.log(this.message)
            this.value=true
          })
          .catch((err) => {
            console.log(err);
          })
    },

    productAccepted(product_id, task) {

          axios
          .patch("http://127.0.0.1:5000/products/pending?product_id="+product_id+"&task="+task,null,{
            headers:
            {
              "Content-Type": "application/json",
                "Authentication-Token":this.auth_token,
            }
          })
          .then((result) => {
            this.fetchdata()
            this.fetchproducts()
            this.message = result.data.message
            console.log(this.message)
            this.value=true
              
          })
          .catch((err) => {
            console.log(err);
          })
    },

    productRejected(product_id, task) {
      
         axios
          .delete("http://127.0.0.1:5000/products/pending?product_id="+product_id+"&task="+task,{
            headers:
            {
              "Content-Type": "application/json",
              "Authentication-Token":this.auth_token,
            }
          })
          .then((result) => {
            this.fetchdata()
            this.fetchproducts()
            this.message = result.data.message
            console.log(this.message)
            this.value=true
              
          })
          .catch((err) => {
            console.log(err);
          })
    }  },
  filters: {
    capitalize: function (data) {
      var capitalized = [];
      data.split(" ").forEach((word) => {
        capitalized.push(
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
      });
      return capitalized.join(" ");
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
