import { Vue } from 'vue-class-component'
import queries from '@/utils/queries'
import { VueCookieNext } from 'vue-cookie-next'

export default class Authenticable extends Vue {
  isAuthenticated = false

  created() {
    this.checkIsAuthenticated()
  }

  checkIsAuthenticated() {
    if (!VueCookieNext.getCookie("token")) {
      this.isAuthenticated = false
    } else {
      queries.isAuthenticated().then(result => {
        this.isAuthenticated = result
      }, _ => {
        this.isAuthenticated = false
      })
    }
  }
}
