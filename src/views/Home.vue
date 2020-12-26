<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <Authentication/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import Authentication from '@/components/Authentication.vue';

@Options({
  components: {
    // HelloWorld,
    Authentication
  },
})
export default class Home extends Vue {}
</script>
