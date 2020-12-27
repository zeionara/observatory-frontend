<template>
  <div class="authentication-form">
    <div v-if="!isAuthenticated">
      <h1>Log in</h1>
      <it-input v-model="login" message="Login" class="sign-in-input-field" :status="authenticationStatus"/>
      <it-input v-model="password" type="password" message="Password" class="sign-in-input-field" :status="authenticationStatus"/>
      <it-button type="primary" pulse outlined class="sign-button" v-on:click="signIn()">Sign in</it-button>
      <it-progressbar id="sign-in-progress-bar" :style="'display: ' + (isProgressBarVisible ? 'block' : 'none')" infinite />
    </div>
    <div v-else>
      <it-button type="danger" pulse outlined class="sign-button" v-on:click="signOut()">Sign out</it-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import queries from '@/utils/queries'
import logging from '@/utils/logging'
import { VueCookieNext } from 'vue-cookie-next'
import encryption from '@/utils/encryption'
import Authenticable from '@/components/Authenticable'

export default class Authentication extends Authenticable {
  login = ""
  password = ""
  authenticationStatus = ""
  isProgressBarVisible = false

  signIn() {
    console.log(`Signing in with credentials ${this.login}:${this.encryptedPassword}...`)
    this.isProgressBarVisible = true
    queries.post('sign-in', { login: this.login, password: this.encryptedPassword })
    .then(response => {
      logging.logObject('Got response:', response)
      const token = response.data?.token
      if (token) {
        VueCookieNext.setCookie('token', token)
      }
      this.authenticationStatus = "success"
      this.checkIsAuthenticated()
      this.$emit("sign-in")
      this.isProgressBarVisible = false
    }, error => {
      logging.logObject('Authentication error:', error)
      this.authenticationStatus = "danger"
      this.isProgressBarVisible = false
    })
  }

  signOut() {
    console.log("Signing out...")
    queries.post('sign-out', {})
    .then(response => {
      logging.logObject('Got response:', response)
      VueCookieNext.removeCookie('token')
      this.checkIsAuthenticated()
      this.$emit("sign-out")
    }, error => {
      logging.logObject('Sign out error:', error)
    })
  }

  get encryptedPassword() {
    return encryption.encrypt(this.password)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.authentication-form {
  width: 500px;
  margin: 0 auto;
}

.sign-button {
  margin: 30px auto;
}

.sign-in-input-field {
  margin-top: 20px;
}
</style>
