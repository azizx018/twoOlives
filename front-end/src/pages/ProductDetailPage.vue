<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product?.imageUrl" />
    </div>
    <div class="product-details">
      <h1 >{{ product?.name }}</h1>
      <h3 class="price">{{ product?.price }}</h3>
      <button v-if="!productExistsInCurrentCart" @click="addToCart" class="add-to-cart">Add To Cart</button>
      <div v-if="productExistsInCurrentCart">
        <button class="grey-button">Item is already in Cart!</button>
      </div>
    </div>
  </div>
  <div v-if="!product">
    <NotFoundPage/>
  </div>

</template>

<script>
import NotFoundPage from './NotFoundPage.vue'
import axios from 'axios';



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