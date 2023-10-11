<template>
  <h1>
    My Cart
  </h1>
 <div v-if="cartItems.length > 0">
  <ShoppingCartList :products="cartItems"/>
  <button class="checkout-button">Checkout</button>
</div>
  <div v-if="cartItems.length === 0">You have no items in your cart!</div>
  
</template>

<script>
import { cartItems } from '../temp-data';
import ShoppingCartList from '@/components/ShoppingCartList.vue';
export default {
  name: "ShoppingCartPage",
  components: {
    ShoppingCartList,

  },
  data() {
    return {
      cartItems,
    }
  }
};
</script>