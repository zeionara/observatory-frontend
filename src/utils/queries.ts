import axios from 'axios'
import { VueCookieNext } from 'vue-cookie-next'

const OBSERVATORY_BACKEND_HOST="localhost"
const OBSERVATORY_BACKEND_PORT=1720

export default {
  post (path: string, body: object) {
    return axios.post(
      `http://${OBSERVATORY_BACKEND_HOST}:${OBSERVATORY_BACKEND_PORT}/${path}`,
      body,
      {
        headers: {
          Authorization: VueCookieNext.getCookie("token")
        }
      }
    )
  },
  get (path: string, params: object = {}) {
    return axios.get(
      `http://${OBSERVATORY_BACKEND_HOST}:${OBSERVATORY_BACKEND_PORT}/${path}`,
      {
        headers: {
          params: params,
          Authorization: VueCookieNext.getCookie('token')
        }
      }
    )
  },
  put (path: string, body: object) {
    return axios.put(
      `http://${OBSERVATORY_BACKEND_HOST}:${OBSERVATORY_BACKEND_PORT}/${path}`,
      body,
      {
        headers: {
          Authorization: VueCookieNext.getCookie('token')
        }
      }
    )
  }
}
