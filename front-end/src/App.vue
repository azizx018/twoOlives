<template>
  <NavBar/>
  <div class="page-wrap">
    <Router-view :user="user"></Router-view>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



export default {
  name: 'App',
  components: {
    NavBar,
},
data() {
  return {
    user: null,
  }

},
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      this.user = user;

    })
  }

}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
