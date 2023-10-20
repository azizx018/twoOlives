<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product?.imageUrl" />
    </div>
    <div class="product-details">
      <h1 >{{ product?.name }}</h1>
      <h3 class="price">{{ product?.price }}</h3>
      <button v-if="!productExistsInCurrentCart" @click="addToCart" class="add-to-cart">Add To Cart</button>
      <button class="grey-button" v-if="productExistsInCurrentCart">Item is already in Cart!</button>
      <button class="sign-in" @click="signIn">Sign in to add to cart</button>
      
    </div>
  </div>
  <div v-if="!product">
    <NotFoundPage/>
  </div>

</template>

<script>
import NotFoundPage from './NotFoundPage.vue'
import axios from 'axios';
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';



export default {
  name: "ProductDetailPage",
  data() {
    return {
      product: {},
      currentCart: []
    }
  },
  methods: {
    async addToCart() {
      await axios.post('/api/users/12345/cart', { id: this.$route.params.productId});
      alert('Items added to your cart!');

    },
    signIn() {
      const email = promt('Please enter your email to sign in:');
      const auth = getAuth();
      const actionCodeSettings = {
        url: `http://localhost:8081/products/${this.$route.params.productId}`,
        handleCodeInApp: true,
      }
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
    }
  },
  components: {
    NotFoundPage
  },
  computed: {
    productExistsInCurrentCart() {
      return this.currentCart.filter(x => x.id === this.product.id).length > 0;
    }

  },
  async created() {
    const response = await axios.get(`/api/products/${this.$route.params.productId}`);
    this.product = response.data;

    //loading the users current cart
    const responseCart = await axios.get('/api/users/12345/cart');
    this.currentCart = responseCart.data;


  }

};
</script>