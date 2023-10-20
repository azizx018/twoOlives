import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import * as VueRouter from "vue-router"
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import ProductDetailPage from './pages/ProductDetailPage.vue';
import NotFoundPage from './pages/NotFoundPage'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRH3_a8iqj91h5vK56Ln5ZTSo77s0Yg5s",
  authDomain: "vue-two-trees.firebaseapp.com",
  projectId: "vue-two-trees",
  storageBucket: "vue-two-trees.appspot.com",
  messagingSenderId: "575751039569",
  appId: "1:575751039569:web:521b4a889cb6ba9da12670"
};

// Initialize Firebase
initializeApp(firebaseConfig);



createApp(App)
.use(VueRouter.createRouter({
  history: VueRouter.createWebHistory(process.env.BASE_URL),
  routes: [{
    path: '/cart',
    component: ShoppingCartPage
  }, {
    path: '/products',
    component: ProductsPage
  }, {
    path: '/products/:productId',
    component:ProductDetailPage
  }, {
    path: '/:pathMatch(.*)*',
    component:NotFoundPage,
  }]
}))

.mount('#app')
