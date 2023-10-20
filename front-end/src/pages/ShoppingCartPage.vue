<template>
  <h1>
    My Cart
  </h1>
 <div v-if="cartItems.length > 0">
  <ShoppingCartList @remove-from-cart="removeFromCart($event)" :products="cartItems"/>
  <button class="checkout-button">Checkout</button>
</div>
  <div v-if="cartItems.length === 0">You have no items in your cart!</div>
  
</template>

<script>
import axios from 'axios';
import ShoppingCartList from '@/components/ShoppingCartList.vue';


export default {
  name: "ShoppingCartPage",
  props: ['user'],
  components: {
    ShoppingCartList,

  },
  data() {
    return {
      cartItems:[],
    }
  },watch: {  
    async user(newUserValue) {
      if (newUserValue) {
        //loading the users current cart
        const responseCart = await axios.get(`/api/users/${newUserValue.uid}/cart`);
        this.currentCart = responseCart.data;
    }

    }

  },
  methods: {
    async removeFromCart(productId) {
      const response = await axios.delete(`/api/users/${this.user.uid}/cart/${productId}`);
      debugger; // eslint-disable-line no-debugger
      const updatedCart = response.data;
      this.cartItems = updatedCart;
    }

  },
  async created() {
    if (this.user) {
      const response = await axios.get(`/api/users/${this.user.uid}/cart`);
      this.cartItems = response.data;

    }
   

  }
};
</script>