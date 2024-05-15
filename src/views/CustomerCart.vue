<template>
    <v-app>
        <NavBar :Username="email" :user="'customer'" ></NavBar>
        <v-container  class="pt-8">
        C A R T D E T A I L S
            <br>
            <br>
            <div v-for="i in cart">
                    <v-card class = "mx-auto my-10" max-width = "300" elevation = "4"  outlined>
                <v-card-title>
                    {{ i.product_name | capitalize }}
                </v-card-title>
                <v-card-body>
                Quantity:     {{ i.quantity }}
                <br>
                Rate:         {{  i.rate_per_unit }} {{ i.unit }}
                </v-card-body>
                <hr/>
                <v-card-actions class=" justify-end pt-0 mb-2 pb-4 pr-0 mr-4">
                    <b class="mr-10">Total: {{ i.quantity * i.rate_per_unit }}</b>

                    <v-btn color="error" @click="deleteCartItem(i.product_name)"  > Delete</v-btn>
                </v-card-actions>
            </v-card>   
        </div>
        <h4>Grand Total: Rs. {{ BillTotal }}   </h4>    
        <v-btn @click="orderNow()">Place Order</v-btn>
        </v-container>
             <v-snackbar  
        :timeout="3000"     
        :value="value"
        fixed
        center
        > 
        {{ message }}
    </v-snackbar>
    </v-app>
</template>

<<script>
import NavBar from '@/components/NavBar.vue';
import axios from "axios"
export default {


    data(){
        return{
          cart: null,
          auth_token: null,
          email: null,
          value: false,
          message:"",
        }
    },
    mounted()
    {
      this.auth_token = localStorage.getItem("Token")
      this.email=localStorage.getItem("Email")
      this.fetchdata()
  
    },
    computed:
  {
    BillTotal: function() 
    {
        var sum=0
        for(var i of this.cart)
        {
            
            sum+=i.rate_per_unit*i.quantity
            console.log(sum);
        }
        return sum
    }   
  },
  components:{
        NavBar
    },

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

    methods:{
        fetchdata: async function () {
      axios
        .get("http://127.0.0.1:5000/cart/"+this.email, {
          headers: {
            "Authentication-Token":this.auth_token,
          }
        })
        .then((result) => {
            console.log(result)
          this.cart = result.data;
        })
        .catch((err) => {
            console.log(err)
        })
    },

    orderNow: async function(){
    axios.patch("http://127.0.0.1:5000/cart/"+this.email,{
          product_name:this.product_name,
          quantity:this.quantity,
    }
    ,{
      headers:{
        "Content-Type": "application/json",
        "Authentication-Token":this.auth_token,
      }
    },)
    .then((res)=>{
      console.log(res)
      this.message = res.data.message
      console.log(this.message)
      this.value = true
      setTimeout(() => {
          window.location="/user/dashboard"
      }, 1500);
    })
    .catch((err) => {
        console.log(err)
    })

    },

    deleteCartItem: async function(product_name){
        axios.delete("http://127.0.0.1:5000/cart/"+this.email+"?product_name="+ product_name,{
            headers:{
            "Content-Type": "application/json",
            "Authentication-Token":this.auth_token,
            }
        })
        .then((res)=>{
            console.log(res)
          this.fetchdata()
        this.message = res.data.message
        console.log(this.message)
        this.value=true
        })
        .catch((err) => {
            console.log(err)
        })

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