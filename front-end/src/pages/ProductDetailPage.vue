<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product?.imageUrl" />
    </div>
    <div class="product-details">
      <h1 >{{ product?.name }}</h1>
      <h3 class="price">{{ product?.price }}</h3>
      <button v-if="user && !productExistsInCurrentCart" @click="addToCart" class="add-to-cart">Add To Cart</button>
      <button class="grey-button" v-if="user && productExistsInCurrentCart">Item is already in Cart!</button>
      <button class="sign-in" @click="signIn" v-if="!user">Sign in to add to cart</button>
      
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
  props: ['user'],
  data() {
    return {
      product: {},
      currentCart: []
    }
  },
  methods: {
    async addToCart() {
      await axios.post(`/api/users/${this.user.uid}/cart`, { id: this.$route.params.productId});
      alert('Items added to your cart!');

    },
    async signIn() {
      const email = prompt('Please enter your email to sign in:');
      const auth = getAuth();
      const actionCodeSettings = {
        url: `https://two-olives-vue-deployment.onrender.com/products/${this.$route.params.productId}`,
        handleCodeInApp: true,
      }
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      alert('Please check your email for a sign in link');
      window.localStorage.setItem('emailForSignIn', email);


    }
  },
  components: {
    NotFoundPage
  },
  computed: {
    productExistsInCurrentCart() {
      //debugger; // eslint-disable-line no-debugger
      return this.currentCart.filter(x => x.id === this.product.id).length > 0;
    }

  },
  watch: {  
    async user(newUserValue) {
      if (newUserValue) {
        //loading the users current cart
        const responseCart = await axios.get(`/api/users/${newUserValue.uid}/cart`);
        this.currentCart = responseCart.data.length === 0 ? [] : responseCart.data;
    }

    }

  },
  async created() {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn');
      await signInWithEmailLink(auth, email, window.location.href);
      alert('Successfully Signed in');
      window.localStorage.removeItem('emailForSignIn');
    }
    const response = await axios.get(`/api/products/${this.$route.params.productId}`);
    this.product = response.data;

    if (this.user) {
      //loading the users current cart
      const responseCart = await axios.get(`/api/users/${this.user.uid}/cart`);
      this.currentCart = responseCart.data;
    }

    


  }

};
</script>