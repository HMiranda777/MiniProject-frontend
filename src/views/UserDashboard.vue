<template>
    <v-app>
    <NavBar :Username="this.email" :user="'customer'" ></NavBar>
    <v-dialog
        persistent
        v-model="dialog"
        width="500"
      >
      <v-form ref="form" @submit.prevent>
       <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Add Quantity
            
          </v-card-title>
          <v-card-text>
            <v-text-field type="number" :rules="rules" v-model="quantity" label="Enter the quantity"></v-text-field>
          </v-card-text>
            <v-card-actions>
            <v-btn
              color="#77BB41"
              style="color: whitesmoke" 
              @click="buyProducts()"
            >
              Buy
            </v-btn>
            <v-btn
            color="error"
            style="color:whitesmoke"
            @click="close()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      </v-dialog>


      <v-dialog
        persistent
        v-model="dialog1"
        width="800"
      >
      <v-card class="px-10 py-10">
      <v-text-field
            v-model="searchQuery"
            label="Search"
            placeholder="Search"
            solo
            style="color:#512B81"
            outlined
          ></v-text-field>
          <v-btn color="#77BB41"  style="color:whitesmoke" v-if="!showSearchResults" @click="searchProducts">Search</v-btn>
           <v-btn color="#512B81" style="color:whitesmoke" v-if="showSearchResults" @click="goBack()">Go back</v-btn>
      <br>
      <br>
    <v-slider
      v-model="slider1.val"
      :label="slider1.label"
      thumb-label="always"
      max="100"
      min="2"
    ></v-slider>
        <v-slider
      v-model="slider2.val"
      :label="slider2.label"
      thumb-label="always"
      max="5000"
      min="101"
    ></v-slider>
    <v-btn color="#512B81" style="color:whitesmoke"  @click="filterByPrice()">Filter</v-btn>
    <v-btn   @click="goBack()">Go Back</v-btn>
    </v-card>
      </v-dialog>


    <v-container mt-10>
    <v-btn @click="openFilter()">FILTERS</v-btn>
    <v-row class="pb-10" v-for="i in category">
    <div style="text-align:left;color:#512B81;font-family: Borel">
    <h2 style="display:inline" >{{ i.category_name | capitalize }}</h2>
    <br>
    </div>
        <v-col v-for="j in i.products" :key="
        j.product_id" cols="12" md="6" lg="4">
          <v-card class="pb-10" max-width="300" elevation="4" outlined>
          <v-img
              height="200"
              :src="`/assets/${j.product_name}.jpg`"
              :alt="j.product_name"
            ></v-img>
            <v-card-title style="font-family: Borel"> 
               {{ j.product_name | capitalize}}
            </v-card-title>
            <v-card-body>
                {{ j.rate_per_unit }} {{ j.unit }}
            <hr/>
              <v-btn v-if="j.quantity!=0" color="#512B81" style="color: whitesmoke" @click="dialogbox(j)">Buy</v-btn>
              <h4 v-else style="color:crimson">OUT OF STOCK</h4>
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
</v-app>
</template>


<script>
import axios from "axios"
import NavBar from "@/components/NavBar.vue"
export default {
   data(){
    return{
        category:null,
        dialog:false,
        dialog1: false,
        product_name:null,
        quantity:null,
        total_quantity:null,
        rules:[
          
            value =>  !!value || 'Required',
            value =>  value>0 || 'minimum quantity is 1',
            value =>  value<=this.total_quantity || 'maximum quantity is'+this.total_quantity
           
        ],
      auth_token: null,
      email: null,
      message: "",
      value: false,
      originalCategory: null,
      searchQuery: "",
      showSearchResults: false,
      slider1: { label: 'Minimum price', val:0,},
      slider2: { label: 'Maximum price', val:0,},
    }

  },

  

  mounted() {
    this.auth_token = localStorage.getItem("Token")
    this.email= localStorage.getItem("Email")
      this.fetchdata();
  },

   methods:{
    fetchdata: async function () {
      axios
        .get("http://127.0.0.1:5000/dashboard", {
          headers: {
            "Authentication-Token": this.auth_token,
          }
          
        })
        .then((result) => {
          console.log(result)
          this.category = result.data;
          this.originalCategory = result.data;
        })
        .catch((err) => {
            console.log(err)
        })

     },

   buyProducts(){
    if(!this.$refs.form.validate())
      return
    this.dialog=false
    axios.post("http://127.0.0.1:5000/cart/"+this.email,{
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
      this.quantity = null
      this.message = res.data.message
      console.log(this.message)
      this.value=true
    })
    .catch((err) => {
        console.log(err)
    })
     },


   dialogbox(j){
      this.dialog=true
      this.product_name=j.product_name
     this.total_quantity = j.quantity
     },

     close() {
       this.dialog = false
      this.quantity=null
     },

     openFilter(){
      this.dialog1 = true;
     },

    searchProducts() {
    // this.dialog1 = false;
    if (this.searchQuery.trim() === "") {
      this.category = this.originalCategory;
    }
    else {
      const matchingCategory = this.originalCategory.find(
        (cat) =>
          cat.category_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      )
      this.showSearchResults = true;
      const filteredProducts = this.originalCategory.map((cat) => {
        if (matchingCategory && cat === matchingCategory) {
          return { ...cat };
        } else {
          return {
            ...cat,
            products: cat.products.filter((product) =>
              product.product_name
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase())
            ),
          };
        }
      });
      this.category = filteredProducts.filter(
        (cat) => cat.products.length > 0 || cat === matchingCategory
      );

    
    }
  
     },

     
     goBack() {
      this.showSearchResults = false;
      this.searchQuery = ""
      this.searchProducts()
      this.dialog1 = false;
     },

     filterByPrice() {
      this.dialog1 = false;
     const minPrice = this.slider1.val;
        const maxPrice = this.slider2.val;

        this.category = this.originalCategory.reduce((acc, cat) => {
            const filteredProducts = cat.products.filter((product) =>
                product.rate_per_unit >= minPrice && product.rate_per_unit <= maxPrice
            );
            
            if (filteredProducts.length > 0) {
                acc.push({
                    ...cat,
                    products: filteredProducts,
                });
            }

            return acc;
        }, []);
     }

     
     
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
  
  components:{
    NavBar,

  },
}
</script>