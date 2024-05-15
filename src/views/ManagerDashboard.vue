<template>
  <div>
    <NavBar :Username="email" :user="'manager'"></NavBar>
    <h1 class="pt-8">I N V E N T O R Y</h1>
    <br />

    <v-btn
      fixed
      bottom
      right
      class="mx-4"
      fab
      dark
      large
      color="black"
      @click="dialog = true"
    >
      <v-icon dark>mdi-plus </v-icon></v-btn
    >
    <v-dialog persistent v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Add Category
        </v-card-title>
        <v-card-text>
           <v-form @submit.prevent ref="addcategory">
          <v-text-field
            :rules="namingRules"
            label="Enter a category name"
            v-model="new_category"
          ></v-text-field>
        </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#77BB41" text @click="addCategory"> Save </v-btn>
          <v-btn
            color="error"
            text
            @click="dialog = false"
            style="color: whitesmoke"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-row class="pb-10" v-for="i in category">
        <div style="display: flex; text-align: left">
          <div v-if="!i.editMode">
            <h2 v-if="i.status == 2" style="display: inline">
              {{ i.category_name | capitalize }}
              <h4 style="color: orange">{{ i.task }} Approval Pending</h4>
            </h2>
            <h2 v-else style="display: inline">
              {{ i.category_name | capitalize }}
            </h2>
          </div>
          <div v-if="i.status !== 2">
            <v-text-field
              v-if="i.editMode"
              style="width: 100%"
              v-model="i.category_name"
              :rules="namingRules"
              label="Category Name"
            ></v-text-field>
            <v-btn class="pb-2" large icon @click="toggleEditCategory(i)"
              ><v-icon style="color: #77bb41"> mdi-tag-edit</v-icon></v-btn
            >
            <v-btn class="pb-2" large icon @click="deleteCategory(i)"
              ><v-icon style="color: red">mdi-delete</v-icon></v-btn
            >
          </div>
        </div>
        <v-col
          v-for="j in i.products"
          :key="j.product_id"
          cols="12"
          md="6"
          lg="4"
        >
          <!-- NORMAL CARD DISPLAY FOR PRODUCTS WITH STATUS 1   -->
          <v-card
            v-if="j.status !== 2"
            class="pb-10"
            max-width="300"
            elevation="4"
            outlined
          >
          <v-img
              height="200"
              :src="`/assets/${j.product_name}.jpg`"
              :alt="j.product_name"
            ></v-img>
            <v-card-title>
              {{ j.product_name | capitalize }}
            </v-card-title>
            <v-card-body>
              <div v-if="!j.editMode">
                {{ j.rate_per_unit }}
                {{ j.unit }}
                {{ j.quantity }}
              </div>
              <div v-else>
                <v-text-field
                  v-model="j.rate_per_unit"
                  :rules="rules"
                  label="Rate per unit"
                ></v-text-field>
                <v-select
                  v-model="j.unit"
                  :rules="rules"
                  :items="items"
                  label="Unit"
                ></v-select>
                <v-text-field
                  v-model="j.quantity"
                  :rules="rules"
                  label="Quantity"
                ></v-text-field>
              </div>
            </v-card-body>
            <hr />
            <v-btn
              color="#77BB41"
              style="color: whitesmoke"
              @click="toggleEditMode(j)"
            >
              {{ j.editMode ? "Save" : "Edit" }}
            </v-btn>
            <v-btn
              class="ml-12"
              color="error"
              style="color: whitesmoke"
              @click="deleteProduct(j)"
            >
              Delete
            </v-btn>
          </v-card>
          <!-- DISABLED CARD DISPLAY FOR APPROVAL PENDING PRODUCTS  -->
          <v-card
            v-else
            class="pb-10"
            max-width="300"
            elevation="4"
            outlined
            disabled
          >
            <v-card-title>
              {{ j.product_name | capitalize }} - {{ j.task }} Pending...
            </v-card-title>
            <v-card-body>
              <div v-if="!j.editMode">
                {{ j.rate_per_unit }} {{ j.unit }} {{ j.quantity }}
              </div>
              <div v-else>
                <v-text-field
                  v-model="j.rate_per_unit"
                  label="Rate per unit"
                ></v-text-field>

                <v-text-field
                  v-model="j.quantity"
                  label="Quantity"
                ></v-text-field>
              </div>
            </v-card-body>
            <hr />
            <v-btn
              color="#77BB41"
              style="color: whitesmoke"
              @click="toggleEditMode(j)"
            >
              {{ j.editMode ? "Save" : "Edit" }}
            </v-btn>
            <v-btn
              class="ml-12"
              color="error"
              style="color: whitesmoke"
              @click="deleteProduct(j)"
            >
              Delete
            </v-btn>
          </v-card>
        </v-col>
        <v-card
          v-if="i.status !== 2"
          class="pb-10 ml-3 mt-3"
          max-width="300"
          style="height: auto"
          elevation="4"
          outlined
        >
          <v-card-body>
            <div v-if="!i.addproductMode">
              <v-btn
                class="mx-4 mt-16"
                fab
                dark
                small
                color="orange"
                @click="toggleAddProduct(i)"
              >
                <v-icon dark>mdi-plus </v-icon></v-btn
              >
            </div>
            <div v-else>
              <v-text-field
                v-model="product_name"
                :rules="rules"
                label="Product Name"
              ></v-text-field>
              <v-text-field
                v-model="rate_per_unit"
                :rules="rules"
                label="Rate per unit"
              ></v-text-field>
                              <v-select
                  v-model="unit"
                  :rules="rules"
                  :items="items"
                  label="Unit"
                ></v-select>
              <v-text-field v-model="quantity" :rules="rules" label="Quantity"></v-text-field>
              <v-btn
                color="#77BB41"
                style="color: whitesmoke"
                @click="addProduct(i)"
                >Add</v-btn
              >
            </div>

          </v-card-body>
        </v-card>
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
import axios from "axios";
import NavBar from "@/components/NavBar.vue";

export default {
  data() {
    return {
      category:[],
      dialog: false,
      new_category: "",
      product_name: "",
      unit: "",
      quantity: "",
      rate_per_unit: "",
      auth_token: null,
      email: null,
      items: ["Rs/kg", "Rs/litre", "Rs/gram"],
            namingRules: [
        (v) => !!v || "Name is required",
        (v) =>(v.length > 2 ) || "Name must be atleast 3 characters ",
      ],
      rules: [
        (v) => !!v || "Required"
      ],
      message: "",
      value:false,
    };
  },
  methods: {
    fetchdata: async function () {
      axios
        .get("http://127.0.0.1:5000/category", {
          headers: {
            "Authentication-Token": this.auth_token,
          },
        })
        .then((result) => {
          this.category = result.data;
          this.category.forEach((category) => {
            this.$set(category, "editMode", false);
            this.$set(category, "addproductMode", false);
            category.products.forEach((product) => {
              this.$set(product, "editMode", false);
            });
          });
          console.log("success");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleEditMode(j) {
      j.editMode = !j.editMode;
      if (!j.editMode) {
        this.saveEditedData(j);
      } else {
        console.log("EditProds");
      }
    },

    toggleEditCategory(i) {
      i.editMode = !i.editMode;
      if (!i.editMode) {
        this.editCategory(i);
      } else {
        console.log("EditCat");
      }
    },
    toggleAddProduct(i) {
      i.addproductMode = !i.addproductMode;
    },
    editCategory(i) {
      axios
        .patch("http://127.0.0.1:5000/category/" + i.category_id, i,{
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.auth_token,
          },
        })
        .then((result) => {
        this.fetchdata();
        this.message = result.data.message
        console.log(this.message)
        this.value=true
        })
        .catch((err) => {
          console.log(err);
        });
    },

    saveEditedData(j) {

      axios
        .patch("http://127.0.0.1:5000/product?product_id=" + j.product_id, j, {
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.auth_token,
          },
        })
        .then((result) => {
        this.fetchdata();
        this.message = result.data.message
        console.log(this.message)
        this.value = true
        this.unit= ""
        this.quantity= ""
        this.rate_per_unit= ""
        
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteProduct(j) {
      axios
        .delete("http://127.0.0.1:5000/product?product_id=" + j.product_id, {
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.auth_token,
          },
        })
        .then((result) => {
        this.fetchdata();
        this.message = result.data.message
        console.log(this.message)
        this.value=true
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteCategory(i) {
      axios
        .delete("http://127.0.0.1:5000/category/" + i.category_id, {
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.auth_token,
          },
        })
        .then((result) => {
        this.fetchdata();
        this.message = result.data.message
        console.log(this.message)
        this.value=true
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addCategory() {
      if (!this.$refs.addcategory.validate())
      {
        return
      }
      this.dialog = false;
      axios
        .post(
          "http://127.0.0.1:5000/category",
          {
            value: this.new_category,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": this.auth_token,
            },
          }
        )
        .then((result) => {
          console.log(result)
          this.fetchdata();
          this.new_category = "";
          this.message = result.data.message
          console.log(this.message)
          this.value=true
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addProduct(i) {
      axios
        .post(
          "http://127.0.0.1:5000/product/" + i.category_id,
          {
            product: this.product_name,
            unit: this.unit,
            quantity: this.quantity,
            rate: this.rate_per_unit,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": this.auth_token,
            },
          }
        )
        .then((result) => {
          console.log(result)
          this.fetchdata();
          this.toggleAddProduct(i);
          this.message = result.data.message
          console.log(this.message)
          this.value = true
          this.product_name=""
          this.unit= ""
          this.quantity= ""
          this.rate_per_unit= ""
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  mounted() {
    this.auth_token = localStorage.getItem("Token");
    this.email = localStorage.getItem("Email");
    this.fetchdata();
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
  components: {
    NavBar,
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
