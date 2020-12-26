<template>
  <div class="authentication-form">
    <h1>Log in</h1>
    <it-input v-model="login" message="Login" class="sign-in-input-field"/>
    <it-input v-model="password" type="password" message="Password" class="sign-in-input-field"/>
    <it-button type="primary" pulse outlined id="sign-in-button" v-on:click="signin()">Sign in</it-button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import queries from '@/utils/queries'
import logging from '@/utils/logging'
import { VueCookieNext } from 'vue-cookie-next'

export default class Authentication extends Vue {
  login = ""
  password = ""

  signin() {
    console.log(`Signing in with credentials ${this.login}:${this.password}...`)
    queries.post('login', { login: this.login, password: this.password })
    .then(response => {
      logging.logObject('Got response:', response)
      if (response.data) {
        VueCookieNext.setCookie('token', response.headers.get('Authorization'))
      }
    }, error => {
      logging.logObject('Authentication error:', error)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.authentication-form {
  width: 500px;
  margin: 0 auto;
}

#sign-in-button {
  margin: 30px auto;
}

.sign-in-input-field {
  margin-top: 20px;
}
</style>
